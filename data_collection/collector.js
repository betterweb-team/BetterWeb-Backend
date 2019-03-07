const Mercury = require('@postlight/mercury-parser');
const fs = require('fs');

const media_urls = require('./urls/media_urls.json');
const config = require('./config.json');

/*
* Configuration Options:
* 
* mode: What data is collected.  Currently the modes are:
*   - title_only: Only the title of each article is collected
* article_count: For each news source, how many articles will be selected
* log_file: Path to the log file
*/

var log_file = fs.createWriteStream(config.log_file);

/*
* This function uses a standard graph traversal algorithm (either BFS of DFS, tbd.) to crawl through a news source.
* Nodes are first checked for whether they actually belong to the news source and whether they have been visited already.
* Adjecency lists will be looped through in a random manner so that different information can be collected each time. 
*/
function crawl(url){
    //
}

// Logger function
function log(message){
    console.log(message);
    log_file.write(message + '\n');
}

// Horribly un-js like isn't it?
while(log_file.pending){}
log(`Log file ready! Beginning collection...`);

// Looping through all urls and attempting to crawl them
var urls = media_urls.media_urls;
for(var url in urls){
    log(`Attempting to crawl ${url}...`);
}