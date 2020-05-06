const fs = require("fs-extra");
const path = require("path");
var copy = require("recursive-copy");
const { exec } = require("child_process");

class Privateer {
  constructor(config) {
    this.basepath = config.basepath ? config.basepath : ""; // REQUIRED
    this.baseport = config.baseport ? config.baseport : "7000";
    this.baseurl = config.baseurl ? config.baseurl : "http://localhost"; // REQUIRED
    this.podname = config.podname ? config.podname : ""; // REQUIRED
    this.podversion = config.podversion ? config.podversion : 0;
    this.css = config.css ? config.css : [];
    this.js = config.js ? config.js : [];
    this.static = config.static ? config.static : [];
    this.content = config.content ? config.content : ""; // REQUIRED
    this.development = config.development ? true : false; // REQUIRED
    this.env = config.env ? config.env : {};
    this.newApp = 1;
  }

  build() {
    return new Promise((resolve, reject) => {
      // validate config
      if (this.validateConfig() && this.validateFolders()) {
        this.copyConfig();
        this.setupDirs();

        this.css.forEach((element) => {
          this.copyFiles("css", element);
        });
        this.js.forEach((element) => {
          this.copyFiles("js", element);
        });

        this.static.forEach((element) => {
          this.copyRecursive(element.prepath, element.src);
        });

        this.reloadProcess();
      } else {
        console.log(
          "Error on privateer: Could not validate config, not all required data is given."
        );
        reject("Could not validate config");
      }
    });
  }

  validateFolders() {
    if (this.basepath !== "") {
      fs.ensureDirSync(this.basepath + "/podlets/");
      const basepath = fs.pathExistsSync(this.basepath);
      const utilpath = fs.pathExistsSync(
        this.basepath + "/utils/templates/podlet.js"
      );
      const podpath = fs.pathExistsSync(this.basepath + "/podlets");

      if (basepath && utilpath && podpath) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  validateConfig() {
    if (
      this.basepath === "" ||
      this.podname === "" ||
      this.podversion === "" ||
      this.content === ""
    ) {
      return 0;
    } else {
      return 1;
    }
  }

  copyConfig() {
    fs.emptyDirSync(this.basepath + "/podlets/" + this.podname + "/");
    fs.copyFileSync(
      this.basepath + "/utils/templates/podlet.js",
      this.basepath + "/podlets/" + this.podname + "/podlet.js"
    );

    if (!fs.pathExistsSync(this.basepath + "/utils/auto/apps.json")) {
      fs.ensureFileSync(this.basepath + "/utils/auto/apps.json");
      fs.copyFileSync(
        this.basepath + "/utils/templates/apps-template.json",
        this.basepath + "/utils/auto/apps.json"
      );
    }
    let appsJson = fs.readJSONSync(this.basepath + "/utils/auto/apps.json");
    let availablePort = process.env.INIT_POD_PORT
      ? process.env.INIT_POD_PORT
      : "7100";
    appsJson.apps.forEach((element, index) => {
      if (element.name === this.podname && this.newApp === 1) {
        appsJson.apps[index].env = {
          BASE_PORT: this.baseport,
          BASE_URL: this.baseurl,
          PORT: availablePort,
          POD_NAME: this.podname,
          POD_VERSION: appsJson.apps[index].env.POD_VERSION + 1,
          POD_CONTENT: this.content,
          NODE_ENV: this.development ? "development" : "production",
          ...this.env,
        };
        this.newApp = 0;
      }
      availablePort++;
    });
    if (this.newApp === 1) {
      let newApp = {
        name: this.podname,
        script: "./podlets/" + this.podname + "/podlet.js",
        env: {
          BASE_PORT: this.baseport,
          BASE_URL: this.baseurl,
          POD_NAME: this.podname,
          POD_VERSION: this.podversion,
          PORT: availablePort,
          POD_CONTENT: this.content,
          NODE_ENV: this.development ? "development" : "production",
          ...this.env,
        },
      };
      appsJson.apps.push(newApp);
    }

    fs.writeJsonSync(this.basepath + "/utils/auto/apps.json", appsJson);
  }

  setupDirs() {
    fs.emptyDirSync(this.basepath + "/podlets/" + this.podname + "/css");
    fs.emptyDirSync(this.basepath + "/podlets/" + this.podname + "/js");
    fs.emptyDirSync(this.basepath + "/podlets/" + this.podname + "/static");
  }
  copyFiles(fileType, src) {
    // fileType : css || js
    if (src.length > 0) {
      const isWin = process.platform === "win32";
      let pathbasename = "";
      if (isWin) {
        pathbasename = path.win32.basename(src);
      } else {
        pathbasename = path.posix.basename(src);
      }
      fs.ensureDirSync(
        this.basepath + "/podlets/" + this.podname + "/" + fileType + "/"
      );
      fs.copyFileSync(
        src,
        this.basepath +
          "/podlets/" +
          this.podname +
          "/" +
          fileType +
          "/" +
          pathbasename
      );
      return 1;
    }
  }

  copyRecursive(prepath = "", src) {
    const options = {
      overwrite: true,
    };
    fs.ensureDirSync(this.basepath + "/podlets/" + this.podname + "/static/");
    return copy(
      src,
      this.basepath + "/podlets/" + this.podname + "/static/" + prepath,
      options
    )
      .then(function (results) {
        return 1;
      })
      .catch(function (error) {
        console.error("Copy failed: " + error);
        return 0;
      });
  }

  reloadProcess() {
    exec(
      "cd " +
        this.basepath +
        " && pm2 startOrReload ./utils/auto/apps.json --update-env",
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
  }

  //SET AND GETS
  setBasepath(newBasePath) {
    this.basepath = newBasePath;
  }
  getBasepath() {
    return this.basepath;
  }
  setBaseport(newBasePort) {
    this.baseport = newBasePort;
  }
  getBaseport() {
    return this.baseport;
  }
  setBaseurl(newBaseUrl) {
    this.baseurl = newBaseUrl;
  }
  getBaseurl() {
    return this.baseurl;
  }

  setPodname(newPodname) {
    this.podname = newPodname;
  }
  getPodname() {
    return this.podname;
  }
  setPodversion(newPodversion) {
    this.podversion = newPodversion;
  }
  getPodversion() {
    return this.podversion;
  }
  setContent(newContent) {
    this.content = newContent;
  }
  getContent() {
    return this.content;
  }
  setDevelopment(newDevelopment) {
    this.development = newDevelopment;
  }
  getDevelopment() {
    return this.development;
  }
  setEnv(newEnv) {
    this.env = newEnv;
  }
  getEnv() {
    return this.env;
  }

  addCss(src) {
    this.css.push(src);
  }
  addJs(src) {
    this.js.push(src);
  }
  addStatic(prepath = "", src) {
    this.static.push({ prepath: prepath, src: src });
  }
}

// export default Privateer;
module.exports = {
  Privateer: Privateer,
};
