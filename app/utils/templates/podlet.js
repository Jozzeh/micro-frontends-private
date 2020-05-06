const express = require('express');
const Podlet = require('@podium/podlet');
const fs = require('fs');

const app = express();

const podlet = new Podlet({
    name: process.env.POD_NAME, // required
    version: process.env.POD_VERSION, // required
    pathname: '/', // required
    manifest: '/manifest.json', // optional, defaults to '/manifest.json'
    development: process.env.NODE_ENV === 'development' ? true : false, // optional, defaults to false
  });


let podCSS = fs.readdirSync(__dirname + '/css');
podCSS.forEach((element) => {
  if(element.indexOf('.css') !== -1 && element.indexOf('.css.map') === -1){
    podlet.css({ value: process.env.BASE_URL + ':' + process.env.BASE_PORT + '/' + process.env.POD_NAME + '/css/' + element });
  }
}); 

let podJS = fs.readdirSync(__dirname + '/js');
podJS.forEach((element) => {
  if(element.indexOf('.js') !== -1 && element.indexOf('.js.map') === -1) {
    if(element.indexOf('.module.js') !== -1) {
      podlet.js({ value: process.env.BASE_URL + ':' + process.env.BASE_PORT + '/' + process.env.POD_NAME + '/js/' + element, defer: '', type: 'esm' });
    } else {
      podlet.js({ value: process.env.BASE_URL + ':' + process.env.BASE_PORT + '/' + process.env.POD_NAME + '/js/' + element, defer: '' });
    }
  }
}); 

app.use(podlet.middleware());

app.use(express.static('static'))

app.get(podlet.content(), (req, res) => {
  res.status(200).podiumSend(process.env.POD_CONTENT);
});

app.get(podlet.manifest(), (req, res) => {
  res.status(200).send(podlet);
});


app.listen(process.env.PORT);
console.log('listening at ' + process.env.PORT);