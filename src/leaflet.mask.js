(function (factory, window) {
    // define an AMD module that relies on 'leaflet'
    if (typeof define === "function" && define.amd) {
        define(["leaflet"], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === "object") {
        module.exports = factory(require("leaflet"));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== "undefined" && window.L) {
        factory(L);
    }
})(function (L) {
    L.Mask = L.LayerGroup.extend({
        options: {
            color: "#3388FF",
            weight: 2,
            fillColor: "#FFFFFF",
            fillOpacity: 1,

            interactive: false,

            fitBounds: true,
            restrictBounds: true,
        },

        initialize: function (geojson, options) {
            L.Util.setOptions(this, options);

            this._layers = {};
            this._bounds = new L.LatLngBounds();
            this._maskPolygonCoords = [
                [
                    [-360, -90],
                    [-360, 90],
                    [360, 90],
                    [360, -90],
                ],
            ];

            if (geojson) {
                if (typeof geojson === "string") {
                    var _that = this;
                    this.request(geojson, function (json) {
                        _that.addData(json);
                    });
                } else {
                    this.addData(geojson);
                }
            }
        },
        addData: function (geojson) {
            this.addObject(geojson);
            this.addMaskLayer();
        },
        addObject: function (json) {
            var i, len;
            if (L.Util.isArray(json)) {
                for (i = 0, len = json.length; i < len; i++) {
                    this.addObject(json[i]);
                }
            } else {
                switch (json.type) {
                    case "FeatureCollection":
                        var features = json.features;
                        for (i = 0, len = features.length; i < len; i++) {
                            this.addObject(features[i]);
                        }
                        return;
                    case "Feature":
                        this.addObject(json.geometry);
                        return;
                    case "GeometryCollection":
                        var geometries = json.geometries;
                        for (i = 0, len = geometries.length; i < len; i++) {
                            this.addObject(geometries[i]);
                        }
                        return;

                    case "Polygon":
                        this.addRemovalPolygonCoordinates(json.coordinates);
                        return;
                    case "MultiPolygon":
                        this.addRemovalMultiPolygonCoordinates(json.coordinates);
                        return;
                    default:
                        return;
                }
            }
        },
        addRemovalPolygonCoordinates: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                this._maskPolygonCoords.push(coords[i]);
                this.updateBounds(coords[i]);
            }
        },
        addRemovalMultiPolygonCoordinates: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                this.addRemovalPolygonCoordinates(coords[i]);
            }
        },
        updateBounds: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                var coords2 = coords[i];
                for (var j = 0, lenJ = coords2.length; j < lenJ; j++) {
                    this._bounds.extend(new L.latLng(coords2[1], coords2[0], coords2[2]));
                }
            }
        },
        addMaskLayer: function () {
            var latlngs = this.coordsToLatLngs(this._maskPolygonCoords);
            var layer = new L.Polygon(latlngs, this.options);
            this.addLayer(layer);
            if (this.options.fitBounds) {
                this._map.fitBounds(this._bounds);
            }
            if (this.options.restrictBounds) {
                this._map.setMaxBounds(this._bounds);
            }
        },
        dimension: function (arr) {
            var j = 1;
            for (var i in arr) {
                if (arr[i] instanceof Array) {
                    if (1 + this.dimension(arr[i]) > j) {
                        j = j + this.dimension(arr[i]);
                    }
                }
            }
            return j;
        },
        coordsToLatLng: function (coords) {
            return new L.LatLng(coords[1], coords[0], coords[2]);
        },
        coordsToLatLngs: function (coords) {
            var latlngs = [];
            var dimensions = this.dimension(coords);
            for (var i = 0, len = coords.length, latlng; i < len; i++) {
                if (dimensions > 2) {
                    latlng = this.coordsToLatLngs(coords[i]);
                } else {
                    latlng = this.coordsToLatLng(coords[i]);
                }
                latlngs.push(latlng);
            }

            return latlngs;
        },
        request: function (url, success, error) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (success && typeof success === "function") {
                            success(xhr.response);
                        }
                    } else {
                        if (error && typeof error === "function") {
                            error();
                        }
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send(null);
        },
    });

    L.mask = function (geojson, options) {
        return new L.Mask(geojson, options);
    };
}, window);
