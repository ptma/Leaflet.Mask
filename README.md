# Leaflet.Mask 

Leaflet.Mask is a Leaflet plugin that loading polygons from geojson to masking the rest of the map.  

Check out the [demo](https://ptma.github.io/Leaflet.Mask/examples/mask.html).

![Preview](https://ptma.github.io/Leaflet.Mask/examples/preview.png)

## Useage example
```javascript
var map = L.map("map", {
    center: [29, 120],
    zoom: 8
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.mask('bound.json', {}).addTo(map);
```

## Creation 

| Factory | Description |
|--------|-------------|
| L.mask((<String|Object> geosjon, <Path options> options?) | Loads layer data in GeoJSON format from a URL or an object， sets styling options. |


## Options  

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| interactive | Boolean | false | If false, the mask layer will not emit mouse events and will act as a part of the underlying map. |
| fitBounds | Boolean | true | If true, the map fits the maximum zoom level to the given geographical bounds. |
| restrictBounds | Boolean | true | If true, the map restricts the view to the given geographical bounds, bouncing the user back if the user tries to pan outside the view. |
### Options inherited from L.Path
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| stroke              | Boolean  | true       | Whether to draw stroke along the path. Set it to false to disable borders on polygons or circles. |
| color               | String   | '#3388ff' | Stroke color |
| weight              | Number   | 2          | Stroke width in pixels |
| opacity             | Number   | 1.0       | Stroke opacity |
| lineCap             | String   | 'round'    | A string that defines shape to be used at the end of the stroke. |
| lineJoin            | String   | 'round'    | A string that defines shape to be used at the corners of the stroke. |
| dashArray           | String   | null       | A string that defines the stroke dash pattern. Doesn't work on Canvas-powered layers in some old browsers. |
| dashOffset          | String   | null       | A string that defines the distance into the dash pattern to start the dash. Doesn't work on Canvas-powered layers in some old browsers. |
| fill                | Boolean  | depends    | Whether to fill the path with color. Set it to false to disable filling on polygons or circles. |
| fillColor           | String   | '#FFFFFF'         | Fill color. |
| fillOpacity         | Number   | 1.0       | Fill opacity. |
| fillRule            | String   | 'evenodd'  | A string that defines how the inside of a shape is determined. |
