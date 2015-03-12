/**
 * Created by lloy3317 on 10/30/14.
 */
define(["esri/geometry/webMercatorUtils"], function (webMercatorUtils){
  var utils = {

    _extent: null,
    getExtent: function (extent){
      this._extent = webMercatorUtils.webMercatorToGeographic(extent);
      return this._extent;
    }
  };
  return utils;
});