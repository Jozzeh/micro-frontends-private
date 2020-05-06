const fs = require("fs");
const privateers = require('../app/utils/privateer');
const Privateer = privateers.Privateer;

const podiumConfig = {
  basepath: '../app',
  podname: 'vuepod',
  content: '<div id="vuepod-content"></div>'
}

let privateer = new Privateer(podiumConfig);
let podJs = fs.readdirSync(__dirname + '/dist/js');
podJs.forEach(element => {
  privateer.addJs('dist/js/' + element);
});

let podCss = fs.readdirSync(__dirname + '/dist/css');
podCss.forEach(element => {
  privateer.addCss('dist/css/' + element);
});

privateer.addStatic('img', 'dist/img');

privateer.build();