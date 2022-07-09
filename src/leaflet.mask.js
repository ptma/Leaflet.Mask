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
            const initialCoordinates = [
                [-3600, -900],
                [-3600, 900],
                [3600, 900],
                [3600, -900],
            ]
            const initialCoordinatesKey = this._hash(initialCoordinates)
            this._maskPolygonCoords = {
                initialCoordinatesKey : initialCoordinates
            };

            if (geojson) {
                if (typeof geojson === "string") {
                    var _that = this;
                    this._request(geojson, function (json) {
                        _that.addData(json);
                    });
                } else {
                    this.addData(geojson);
                }
            }
        },
        addData: function (geojson) {
            this._addObject(geojson);
            this._setMaskLayer();
        },
        removeData: function (geojson) {
            this._removeObject(geojson);
            this._setMaskLayer();
        },
        _addObject: function (json) {
            var i, len;
            if (L.Util.isArray(json)) {
                for (i = 0, len = json.length; i < len; i++) {
                    this._addObject(json[i]);
                }
            } else {
                switch (json.type) {
                    case "FeatureCollection":
                        var features = json.features;
                        for (i = 0, len = features.length; i < len; i++) {
                            this._addObject(features[i]);
                        }
                        return;
                    case "Feature":
                        this._addObject(json.geometry);
                        return;
                    case "GeometryCollection":
                        var geometries = json.geometries;
                        for (i = 0, len = geometries.length; i < len; i++) {
                            this._addObject(geometries[i]);
                        }
                        return;
                    case "Polygon":
                        this._addRemovalPolygonCoordinates(json.coordinates);
                        return;
                    case "MultiPolygon":
                        this._addRemovalMultiPolygonCoordinates(json.coordinates);
                        return;
                    default:
                        return;
                }
            }
        },
        _removeObject: function (json) {
            var i, len;
            if (L.Util.isArray(json)) {
                for (i = 0, len = json.length; i < len; i++) {
                    this._removeObject(json[i]);
                }
            } else {
                switch (json.type) {
                    case "FeatureCollection":
                        var features = json.features;
                        for (i = 0, len = features.length; i < len; i++) {
                            this._removeObject(features[i]);
                        }
                        return;
                    case "Feature":
                        this._removeObject(json.geometry);
                        return;
                    case "GeometryCollection":
                        var geometries = json.geometries;
                        for (i = 0, len = geometries.length; i < len; i++) {
                            this._removeObject(geometries[i]);
                        }
                        return;
                    case "Polygon":
                        this._removeRemovalPolygonCoordinates(json.coordinates);
                        return;
                    case "MultiPolygon":
                        this._removeRemovalMultiPolygonCoordinates(json.coordinates);
                        return;
                    default:
                        return;
                }
            }
        },
        _addRemovalPolygonCoordinates: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                const key = this._hash(coords[i])
                this._maskPolygonCoords[key] = coords[i];
                this._updateBounds(coords[i]);
            }
        },
        _addRemovalMultiPolygonCoordinates: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                this._addRemovalPolygonCoordinates(coords[i]);
            }
        },
        _removeRemovalPolygonCoordinates: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                const key = this._hash(coords[i])
                delete this._maskPolygonCoords[key];
            }
        },
        _removeRemovalMultiPolygonCoordinates: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                this._removeRemovalPolygonCoordinates(coords[i]);
            }
        },
        _updateBounds: function (coords) {
            for (var i = 0, len = coords.length; i < len; i++) {
                var coords2 = coords[i];
                for (var j = 0, lenJ = coords2.length; j < lenJ; j++) {
                    this._bounds.extend(new L.latLng(coords2[1], coords2[0], coords2[2]));
                }
            }
        },
        _setMaskLayer: function () {
            if(this.masklayer){
                this.removeLayer(this.masklayer)
            }
            var latlngs = this._coordsToLatLngs(Object.values(this._maskPolygonCoords));
            var layer = new L.Polygon(latlngs, this.options);
            this.masklayer = layer
            this.addLayer(layer);
            if (this.options.fitBounds && this._map) {
                this._map.fitBounds(this._bounds);
            }
            if (this.options.restrictBounds && this._map) {
                this._map.setMaxBounds(this._bounds);
            }
        },
        _dimension: function (arr) {
            var j = 1;
            for (var i in arr) {
                if (arr[i] instanceof Array) {
                    if (1 + this._dimension(arr[i]) > j) {
                        j = j + this._dimension(arr[i]);
                    }
                }
            }
            return j;
        },
        _coordsToLatLng: function (coords) {
            return new L.LatLng(coords[1], coords[0], coords[2]);
        },
        _coordsToLatLngs: function (coords) {
            var latlngs = [];
            var _dimensions = this._dimension(coords);
            for (var i = 0, len = coords.length, latlng; i < len; i++) {
                if (_dimensions > 2) {
                    latlng = this._coordsToLatLngs(coords[i]);
                } else {
                    latlng = this._coordsToLatLng(coords[i]);
                }
                latlngs.push(latlng);
            }

            return latlngs;
        },
        _request: function (url, success, error) {
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
        _hash: function(coordinates) {
            return btoa(JSON.stringify(coordinates))
        }
    });

    L.mask = function (geojson, options) {
        return new L.Mask(geojson, options);
    };
}, window);