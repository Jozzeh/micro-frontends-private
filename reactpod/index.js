
const fs = require("fs");
const privateers = require('../app/utils/privateer');
const Privateer = privateers.Privateer;

const podiumConfig = {
  basepath: '../app',
  podname: 'reactpod',
  content: '<div id="reactpod-root"></div>'
}

let privateer = new Privateer(podiumConfig);

let rawdata = fs.readFileSync('build/asset-manifest.json');
let assets = JSON.parse(rawdata);
assets.entrypoints.forEach((element, index) => {
  if(element.indexOf('.css') !== -1){
    privateer.addCss('build/' + element);
  }else if(element.indexOf('.js') !== -1) {
    privateer.addJs('build/' + element);
  }
});

privateer.addStatic('reactpod-assets', 'build/reactpod-assets');

privateer.build();