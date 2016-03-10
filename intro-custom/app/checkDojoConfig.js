/**
 * Created by lloy3317 on 12/16/15.
 */
define(function (){
  ["dgrid", "dijit", "dojo", "dojox", "dstore", "esri", "put-selector", "xstyle", "app"].forEach(function (packageName){
    console.log("require.toUrl(\"%s\"): %s", packageName, require.toUrl(packageName));
  });
});
