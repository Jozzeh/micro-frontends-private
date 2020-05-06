const express = require("express");
const app = express();
const waiters = require('./utils/waiter');
const waiter = new waiters.Waiter;

require("./routes/home")(app);

app.use(express.static("assets"));
const podStaticFolders = waiter.getPodletStatics();
podStaticFolders.forEach(element => {
  app.use(express.static(element));
});
const podStyleFolders = waiter.getPodletStyleAndBehavior();
podStyleFolders.forEach(element => {
  app.use(element.podname, express.static(element.podpath));
});

app.listen(7000);
console.log('Base application listening at port: 7000');