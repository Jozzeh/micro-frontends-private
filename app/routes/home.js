const dotenv = require("dotenv");
const result = dotenv.config();
const Layout = require("@podium/layout");
const utils = require("@podium/utils");

const waiters = require('../utils/waiter');
const waiter = new waiters.Waiter;

module.exports = function (app) {
  const layout = new Layout({
    name: "homeLayout", // required
    pathname: "/", // required
  });

  layout.view(
    (incoming, body, head) => `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
      ${incoming.css.map(utils.buildLinkElement).join("\n")}
      <link href="/css/demo.css" type="text/css" rel="stylesheet">
      <title>${incoming.view.title}</title>
    </head>
    <body>
      ${body}
      ${incoming.js.map(utils.buildScriptElement).join("\n")}
    </body>
  </html>`
  );

  const htmlbuspodlet = layout.client.register({
    name: "htmlBusPodlet", // required
    uri: waiter.getPodletManifest('htmlbuspod'), // required
  });

  const reactpodlet = layout.client.register({
    name: "reactPodlet", // required
    uri:  waiter.getPodletManifest('reactpod'), // required
  });

  const sveltepodlet = layout.client.register({
    name: "sveltePodlet", // required
    uri:  waiter.getPodletManifest('sveltepod'), // required
  });

  const vuepodlet = layout.client.register({
    name: "vuePodlet", // required
    uri:  waiter.getPodletManifest('vuepod'), // required
  });

  app.use(layout.middleware());

  app.get("/", async (req, res) => {
    const incoming = res.locals.podium;
    const content = await Promise.all([
      htmlbuspodlet.fetch(incoming),
      reactpodlet.fetch(incoming),
      sveltepodlet.fetch(incoming),
      vuepodlet.fetch(incoming),
    ]);

    incoming.podlets = content;
    incoming.view.title = "Home Page";

    res.podiumSend(`<div class="demo-header">
      Private micro front-ends: Vanilla + React + Svelte + Vue
    </div>
    <div class="demo-container">
      <div class="demo-flex">
        <div class="demo-leftpanel">
          <div class="demo-left-react">
            ${content[1]}
          </div>
          <div class="demo-left-html">
            ${content[0]}
          </div>
        </div>
        <div class="demo-rightpanel">
          <div class="demo-left-svelte">
            ${content[2]}
          </div>
          <div class="demo-left-vue">
            ${content[3]}
          </div>
        </div>
      </div>
    </div>
    `);
  });
};