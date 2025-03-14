import Feature from '../src/ol/Feature.js';
import Map from '../src/ol/Map.js';
import View from '../src/ol/View.js';
import {altKeyOnly, click, pointerMove} from '../src/ol/events/condition.js';
import Point from '../src/ol/geom/Point.js';
import Select from '../src/ol/interaction/Select.js';
import VectorLayer from '../src/ol/layer/Vector.js';
import VectorSource from '../src/ol/source/Vector.js';
import Fill from '../src/ol/style/Fill.js';
import Stroke from '../src/ol/style/Stroke.js';
import Style from '../src/ol/style/Style.js';
import {Circle} from '../src/ol/style.js';

const center = [567729, 5465442];
const vectorSource = new VectorSource();
const features = [];

for (let i = 0; i < 7000; i++) {
  const offsetX = (Math.random() - 0.5) * 10;
  const offsetY = (Math.random() - 0.5) * 10;
  features.push(
    new Feature({
      geometry: new Point([
        center[0] + offsetX * 100,
        center[1] + offsetY * 100,
      ]),
    }),
  );
}

let lastClickTime = null;

vectorSource.addFeatures(features);

const vector = new VectorLayer({
  source: vectorSource,
  style: new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({color: 'rgba(255, 153, 0, 0.8)'}),
      stroke: new Stroke({color: 'rgba(0, 0, 0, 1)', width: 1}),
    }),
  }),
});

const map = new Map({
  layers: [vector],
  target: 'map',
  view: new View({center, zoom: 11}),
});

const selected = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({color: 'rgba(255, 50, 0, 0.8)'}),
    stroke: new Stroke({color: 'rgba(0, 0, 0, 1)', width: 1}),
  }),
});

const selectStyle = () => selected;

const selectClick = new Select({
  condition: click,
  style: selectStyle,
  multi: true,
});

map.addInteraction(selectClick);
selectClick.on('select', (e) => {
  const selectionTime = performance.now();
  const timeDiff = lastClickTime
    ? ((selectionTime - lastClickTime) / 1000).toFixed(2)
    : 'N/A';

  document.getElementById('status').innerHTML = `&nbsp;${e.target
    .getFeatures()
    .getLength()} selected features in ${timeDiff}s`;
});

map.on('click', (event) => {
  lastClickTime = performance.now();
  console.log('Pixel clicked:', event.pixel);
});
