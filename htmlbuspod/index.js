const fs = require("fs");
const privateers = require('../app/utils/privateer');
const Privateer = privateers.Privateer;

const podiumConfig = {
  basepath: '../app',
  podname: 'htmlbuspod',
  content: '<div style="text-align:center; margin-top: 25px; padding: 15px; border: solid 1px #f5f5f5;"><img style="width: 75px;" src="/htmlbus-assets/images/html.png"/><p style="font-size: 11px; color: #333;">Images plain HTML</p></div>'
}

let privateer = new Privateer(podiumConfig);
let podJs = fs.readdirSync(__dirname + '/htmlbus-assets/js');
podJs.forEach(element => {
  privateer.addJs('htmlbus-assets/js/' + element);
});

let podCss = fs.readdirSync(__dirname + '/htmlbus-assets/css');
podCss.forEach(element => {
  privateer.addCss('htmlbus-assets/css/' + element);
});

privateer.addStatic('htmlbus-assets/images', 'htmlbus-assets/images');

privateer.build();