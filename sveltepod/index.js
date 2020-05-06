

const fs = require("fs");
const privateers = require('../app/utils/privateer');
const Privateer = privateers.Privateer;

const podiumConfig = {
  basepath: '../app',
  podname: 'sveltepod',
  content: '<div id="sveltepod"></div>'
}

let privateer = new Privateer(podiumConfig);

let svelteassets = fs.readdirSync('public/build');

svelteassets.forEach((element, index) => {
  if(element.indexOf('.css') !== -1 && element.indexOf('.css.map') === -1){
    privateer.addCss('public/build/' + element);
  }else if(element.indexOf('.js') !== -1 && element.indexOf('.js.map') === -1) {
    privateer.addJs('public/build/' + element);
  }
}); 

privateer.addStatic('svelte-assets', 'public/svelte-assets');

privateer.build();