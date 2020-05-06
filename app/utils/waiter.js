const fs = require("fs-extra");

class Waiter {
  getPodletManifest(podname) {
    //read the apps & retrieve port
    let manifestUri = "";
    let appsJson = fs.readJSONSync(__dirname + "/auto/apps.json");
    appsJson.apps.forEach((element, index) => {
      if (element.name === podname) {
        manifestUri = "http://localhost:" + element.env.PORT + "/manifest.json";
      }
    });
    //return podletmanifest uri
    return manifestUri;
  }

  getPodletStatics() {
    let podletStatics = [];
    let appsJson = fs.readJSONSync(__dirname + "/auto/apps.json");
    appsJson.apps.forEach((element, index) => {
      podletStatics.push("./podlets/" + element.name + "/static");
    });
    //return podletmanifest uri
    return podletStatics;
  }

  getPodletStyleAndBehavior() {
    let podletStatics = [];
    let appsJson = fs.readJSONSync(__dirname + "/auto/apps.json");
    appsJson.apps.forEach((element, index) => {
      podletStatics.push({
        podpath: "./podlets/" + element.name,
        podname: "/" + element.name,
      });
    });
    //return podletmanifest uri
    return podletStatics;
  }
}

module.exports = {
  Waiter: Waiter,
};
