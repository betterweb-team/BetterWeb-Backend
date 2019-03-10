/**
 * Simulates a coin flip
 */
function coinFlip(){
    return Math.random() >= 0.5;
}

/**
 * Shuffles the provided list/array
 * @param {Array} array The array that is being shuffled
 */
function shuffle(array){
    array.sort(coinFlip);
}

/**
 * Gets all matches of a regular expression on a string
 * @param {string} string The string to match
 * @param {RegExp} regex The regular expression to match with
 * @param {number} captureGroup Which capture group to capture.  Note that this is one-indexed
 * @returns {Array} A array of all the matches
 */
function getMatches(string, regex, captureGroup=1){
    var matches = [];
    var match = regex.exec(string);

    while(match){
        matches.push(match[captureGroup]);
        match = regex.exec(string);
    }

    return matches;
}

//TODO
/**
 * Sends a get request to the specified URL and returns the response body
 * @param {string} url The URL to send a request to
 * @return {string} The response from the request
 */
async function get(url){
    //
}

module.exports = {
    shuffle: shuffle,
    getMatches: getMatches,
    get: get
};