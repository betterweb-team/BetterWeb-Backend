const Mercury = require('@postlight/mercury-parser');
const CollectorUtils = require('./collector_utils.js');
const Deque = require('./deque.js');

const fs = require('fs');

const media_urls = require('./urls/media_urls.json');
const config = require('./config.json');

const HREFS_REGEX = /href="(.*?)"/g;

/**
* Configuration Options:
* 
* mode: What data is collected.  Currently the modes are:
*   - title_only: Only the title of each article is collected
* article_count: For each news source, how many articles will be selected
* log_file: Path to the log file
* source_output_file: Output file with the results of the crawl grouped by which source they come from
* training_output_file: Output file with the results of the crawl as a list, with each entry containing the data and bias value of the source
* debug: Debug mode.  Among other things it restricts the amount of sources crawled to make testing faster
*/

var logFile = fs.createWriteStream(config.log_file);
var sourceOutput = {};
var trainingOutput = []

/**
 * Logger function
 * @param {string} message Message to log
 * @return {void}
 */
function log(message){
    console.log(message);
    logFile.write(message + '\n');
}

/**
 * This function uses a standard graph traversal algorithm (either BFS of DFS, tbd.) to crawl through a news source.
 * Nodes are first checked for whether they actually belong to the news source and whether they have been visited already.
 * Adjecency lists will be looped through in a random manner so that different information can be collected each time. 
 * @param {string} startUrl The url to begin from
 * @param {string} urlMatch The url to match (so we never leave the search website)
 * @return {void}
 */
async function crawl(startUrl, urlMatch){
    var next = new Deque.Deque();
    var vis = {};
    var searchedURLs = 1;

    /**
     * Parses the given url and puts it into the visited array
     * @param {string} url The URL to parse
     * @return {Array} An array of the children of that url.  If the request fails, `null` will be returned instead
     */
    async function parseDataFor(url){
        return new Promise(function(resolve, _){
            Mercury.parse(url)
                .then(parseData => {
                    if(config.mode == 'title_only'){
                        vis[url] = {
                            "title": parseData.title
                        };
                    }
        
                    var children = CollectorUtils.getMatches(parseData.content, HREFS_REGEX, 1).filter(
                        url => url.includes(urlMatch)
                    );
                    CollectorUtils.shuffle(children);

                    resolve(children);
                })
                .catch(err => {
                    log(`An error occured while sending the request: ${err}`);
                    resolve(null);
                });
        });
    }

    next.push(startUrl);
    while(!next.empty()){
        var cur = next.pop(true);

        if(cur === null || cur === undefined)
            continue;

        log(`-- Currently at ${cur} (start=${startUrl})`);

        var children = await parseDataFor(cur);
        if(children === null) continue;

        for(var child in children){
            child = children[child];

            if(searchedURLs > config.article_count)
                break;

            if(!vis[child]){
                next.push(child);
                searchedURLs++;
            }
        }
    }

    return vis;
}

if(config.debug)
    log('Debug mode is ON');

// Horribly un-js like isn't it?
while(logFile.pending){}
log(`Log file ready! Beginning collection...`);

(async function(){
    var ctr = 0; // Counter for debugging purposes
    var urls = media_urls.media_urls;
    for(var url in urls){
        log(`[ ==== ] Attempting to crawl ${url}... [ ==== ]`);
        
        var currOutput = await crawl(urls[url][0].homepage, url), trainingData = Array.from(Object.values(currOutput));
        sourceOutput[url] = currOutput;
        for(var i = 0; i < trainingData.length; i++)
            trainingOutput.push({data: trainingData[i], bias: urls[url][0].bias});

        if(config.debug && ++ctr >= 7)
            break;
    }

    fs.writeFileSync(config.source_output_file, JSON.stringify(sourceOutput));
    fs.writeFileSync(config.training_output_file, JSON.stringify(trainingOutput));

    log('Crawl complete!');
})();