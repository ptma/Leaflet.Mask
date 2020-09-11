# Leaflet.Mask 
Leaflet.Mask 是一个 Leaflet 插件， 用于将边界数据以外的地图区域遮盖起来，可以用它来实现重点显示局部地图区域的效果。  

在线 [demo](https://ptma.gitee.io/leaflet.mask/examples/mask.html).

![Preview](https://ptma.gitee.io/leaflet.mask/examples/preview.png)

## 用法示例
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

## 调用 
```javascript
L.mask(geosjon, options?)
```
| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| geosjon | String\|Object | .geojson URL 或 GeoJSON 对象 |
| options | Object | 遮罩图层选项 |

## 选项
| 选项 | 类型 | 默认值 | 描述 |
|--------|------|---------|-------------|
| interactive | Boolean | false | 如果为 false，遮罩层将不处理鼠标事件，行为形同基础图层。 |
| fitBounds | Boolean | true | 如果为 true，地图会自动放大缩放等级到遮罩区域的最大边界。 |
| restrictBounds | Boolean | true | 如果为 true，地图将被会限制移动出遮罩区域。 |
### 继承自 L.Path 的样式选项
| 选项 | 类型 | 默认值 | 描述 |
|--------|------|---------|-------------|
| stroke              | Boolean  | true       | 是否绘制边框。 |
| color               | String   | '#3388ff' | 边框颜色。 |
| weight              | Number   | 2          | 边框宽度。 |
| opacity             | Number   | 1.0       | 边框透明度。 |
| lineCap             | String   | 'round'    | 指定如何绘制每一条线段末端的属性。有 3 个可能的值，分别是：'butt'，'round' 或 ’square‘。  |
| lineJoin            | String   | 'round'    | 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性（长度为0的变形部分，其指定的末端和控制点在同一位置，会被忽略）。 |
| dashArray           | String   | null       | 控制用来描边的点划线的图案范式。 |
| dashOffset          | String   | null       | dash模式到路径开始的距离。 |
| fill                | Boolean  | depends    | 是否用颜色填充。 |
| fillColor           | String   | '#FFFFFF'         | 填充色。 |
| fillOpacity         | Number   | 0.2       | 填充透明度。 |
| fillRule            | String   | 'evenodd'  | 填充规则。 |
