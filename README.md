# Private micro frontends  
This is a demonstration of  micro front-ends using the podium framework without the use of a CDN to serve the static files.    
With CDN - micro front-end example: https://github.com/Jozzeh/micro-frontends-divers   
Podium framework : https://podium-lib.io/ 

Vanilla JS + React + VueJS + Svelte are combined in a single application. 

## How to start  
You will need :  
- NPM
- Yarn (for react)
- Node
- PM2 (global // npm install -g pm2 // node process manager // https://pm2.keymetrics.io/  ) 

1. clone the repo
2. go in the root folder 
3. run command : npm run installAll
4. run command : npm run startAll


## How does it work  
In the app/utils folder, there is a Privateer and Waiter class.  
Privateer : Making micro front-ends private  
Waiter : serving micro front-ends to the base application.  

* These classes could be a npm package/module in the future

The Privateer is used in the micro front-ends to copy css, js and other static files to the base application folder.  
After copying the files, a podlet file is automatically created (see podlets folder in base app after running the startAll command) and the podlet is started using PM2.  
This setup is using an ecosystem pm2 file, which is automatically generated in the base-app/utils/auto/apps.json file.

The Waiter class is used in the base application.  
It retrieves the micro frontend data and returns that data to the base application.

## Updating micro front-ends  
After updating a micro front-end, run the command: "npm run podiumbuild".  
That command will build the micro front-end in the base application (so copy necessairy files and restart/reload the podlet).  

## Creating a new micro front-end  
Create a new folder using your favourite framework, or just go vanilla...  
Create a js script file and import the privateer class (app/utils/privateer).  
You can instance the privateer class with an object containing: 
- basepath // REQUIRED, is the path to your base application 
- baseport // OPTIONAL, is the port of your base application, defaults to "7000"
- baseurl // REQUIRED, is the public url of the base application "http://localhost"
- podname // REQUIRED, is a unique name for your podlet (lowercase, no spaces is advised)
- css // ARRAY - is an array with paths to all css-files, use privateer.addCss function to easily add css files to the array
- js // ARRAY - is an array with paths to all css-files, use privateer.addJs function to easily add js files to the array
- static // ARRAY - is an array with objects {public url to static files, paths to FOLDERS that contain all static assets}  
  Example: privateer.addStatic('reactpod-assets', 'build/reactpod-assets');  
  The assets from the example are served from PUBLIC_URL/reactpod-assets/HERE_ALL_STATIC_ASSETS
- content // STRING, REQUIRED, is the html which should be inserted in the podlet
- development // BOOLEAN
- env // Extra environmental variables

Or just have a look at the example frameworks in this repository...
