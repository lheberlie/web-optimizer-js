// jshint esversion:6, node:true

let _                        = require("lodash"),
    fs                       = require("fs"),
    path                     = require("path"),
    url                      = require("url"),
    glob                     = require("glob"),
    sourceDir                = __dirname,
    appDir                   = "ed_simpletoolbar",
    harFile                  = path.join(sourceDir, "data", "network-data.har"),
    harResultsFile           = path.join(sourceDir, "data", "network-results.txt"),
    //                https?://js\w*\.?([\w]+\.?)*/[-+_=.?:,/%\w\d]*
    esriURLRegEx             = /https?:\/\/js\w*\.?([\w]+\.?)*\/[-+_=(.|\n)?:,\/%\w\d]*/im,
    //                https?://heb\.?([\w]+\.?)*/[-+_=.?:,/%\w\d]*
    localURLRegEx            = /https?:\/\/heb\.?([\w]+\.?)*\/[-+_=(.|\n)?:,\/%\w\d]*/im,
    //                https?://[a-zA-z0-9]+\.[a-zA-Z]+\.[a-zA-Z]+(/[a-zA-Z%20]*)*.*
    anyURLRegEx              = /https?:\/\/([\w]+\.?)*\/[-+_=(.|\n)?:,\/%\w\d]*/im,
    localURLs                = [],
    esriCDNURLs              = [],
    anyURLs                  = [],
    brokenURLs               = [],
    urlStrings               = "",
    // RegEx patterns to match Dojo and esrijs AMD modules
    //searchText.match(/"(esri|dojo|dojox|dijit|xstyle|put-selector|dgrid)\/{1,}([-a-zA-Z0-9_\/]+[^!]?)"/im)
    patternMatchModuleInURL  = /(esri|dojo|dojox|dijit|xstyle|put-selector|dgrid)\/{1,}([-a-zA-Z0-9_\/]+)/im,
    patternMatchModuleInFile = /"(esri|dojo|dojox|dijit|xstyle|put-selector|dgrid)\/{1,}([-a-zA-Z0-9_\/]+[^!]?)"/gm,
    assetTypeRegEx           = /\.(gif|jpg|png|svg|ico|bmp|css)/i,
    modulesFile              = path.join(sourceDir, "data", "modules.txt"),
    globJSFiles              = path.join(sourceDir, appDir, "**/*.js"),
    globHTMLFiles            = path.join(sourceDir, appDir, "**/*.html"),
    globJSMatch              = glob.sync(path.join(sourceDir, appDir, "**/*.js")),
    globHTMLMatch            = glob.sync(path.join(sourceDir, appDir, "**/*.html")),
    globFiles                = _.concat(globHTMLMatch, globJSMatch),
    modulesArrayRaw          = JSON.parse(fs.readFileSync(path.join(sourceDir, "data", "known-modules.json"), "utf-8")),
    modulesArray             = [];

/**
 * Sorts and flattens an array of URL objects
 * and returns an array of the URLs sorted.
 *
 * @param value - An array of URL objects
 * @returns flattenedUrls - An array of the the URLs sorted.
 *
 */
function sortThenNormalizeURLObjects(value){
  "use strict";
  // sortBy hostname, then path
  let sortedURLs = _.sortBy(value, ["hostname", "path"]);
  let flattenedURLs = sortedURLs.map(function (item){
    // return href
    return item.href;
  });
  return flattenedURLs.join("\n");
}

console.log("Parsing HAR input: %s", harFile);

let rawHarData = fs.readFileSync(harFile, "utf-8");
let harData = JSON.parse(rawHarData).log;

harData.entries.forEach(function (harEntry){
  "use strict";
  let harRequest = harEntry.request;
  let requestURL = harRequest.url;

  if (esriURLRegEx.test(requestURL)) {
    esriCDNURLs.push(url.parse(requestURL));
  }
  else if (localURLRegEx.test(requestURL)) {
    localURLs.push(url.parse(requestURL));
  }
  else if (anyURLRegEx.test(requestURL)) {
    anyURLs.push(url.parse(requestURL));
  }
  else {
    console.log(requestURL);
  }

  if (!assetTypeRegEx.test(requestURL)) {
    if (patternMatchModuleInURL.test(requestURL)) {
      let patternMatch = requestURL.match(patternMatchModuleInURL);

      if (patternMatch && patternMatch[0]) {
        modulesArrayRaw.push(patternMatch[0]);
      }
    }
  }

  if (harEntry.response.status === 404) {
    brokenURLs.push(url.parse(requestURL));
  }
});

if (esriCDNURLs.length > 0) {
  urlStrings += "// Esri CDN URLs\n" + sortThenNormalizeURLObjects(esriCDNURLs);
}
if (localURLs.length > 0) {
  urlStrings += "\n// Application URLs\n" + sortThenNormalizeURLObjects(localURLs);
}
if (anyURLs.length > 0) {
  urlStrings += "\n// Other URLs\n" + sortThenNormalizeURLObjects(anyURLs);
}
if (brokenURLs.length > 0) {
  urlStrings += "\n// Broken URLs\n" + sortThenNormalizeURLObjects(brokenURLs);
}

globFiles.forEach(function (globFile){
  "use strict";
  let inputFile = fs.readFileSync(globFile, "utf-8");
  let inputFileModulesMatch = inputFile.match(patternMatchModuleInFile);
  let inputFileModulesMatchClean = inputFileModulesMatch.map(function (item){
    return item.replace(/"/g, "");
  });
  let mergeArrays = inputFileModulesMatchClean.concat(modulesArrayRaw);
  modulesArrayRaw = mergeArrays;
});

if (modulesArrayRaw && modulesArrayRaw.length > 0) {
  modulesArray = _.sortedUniq(modulesArrayRaw);
}

fs.writeFileSync(harResultsFile, urlStrings, "utf-8");
fs.writeFileSync(modulesFile, modulesArray.join("\n"), "utf-8");

console.log("Saving HAR output: %s", harResultsFile);
console.log("Saving modules output: %s", modulesFile);
