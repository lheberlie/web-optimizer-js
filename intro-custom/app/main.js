/**
 * Created by lloy3317 on 12/16/15.
 */

define([
  "esri/map",
  "dojo/text!./config.json",
  "dojo/domReady!"
], function (Map, appConfig){
  var config = JSON.parse(appConfig);

  var map = new Map(config.map.view.divID, {
    basemap: config.map.basemap,
    center: config.map.center, // long, lat
    zoom: config.map.zoom,
    sliderStyle: "small"
  });

  map.on("load", function(event){
    console.log("Map loaded: %s", event);
  });
});