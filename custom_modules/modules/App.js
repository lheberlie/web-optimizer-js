/**
 * Created by lloy3317 on 10/30/14.
 */
define([
  "dojo/dom",
  "dojo/_base/declare",
  "esri/map"
], function (dom, declare, Map){

  var _app = declare(null, {
    _map: null,
    var1: null,
    var2: null,

    constructor: function (containerId, params){
      console.log("constructor: ", containerId, params);
      dom.byId()
      this._map = new Map(containerId, params);
    },
    getMap: function (){
      return this._map;
    }
  });

  return _app;
})
;