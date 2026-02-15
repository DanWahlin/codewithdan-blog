---
title: "Node.js/Express Convention-Based Routes"
date: 2017-11-16
categories: 
  - "express"
  - "javascript"
  - "node-js"
coverImage: "2017-10-27_20-17-22.webp"
---

[![](/images/blog/node-js-express-convention-based-routes/2017-10-27_20-17-22.webp)](https://blog.codewithdan.com/wp-content/uploads/2017/11/2017-10-27_20-17-22.png)I've always been a fan of convention-based routing so I converted a local route generation script I've been using with Node.js/Express applications into an npm package called [express-convention-routes](https://www.npmjs.com/package/express-convention-routes). The package can be used to automate the creation of Express routes based on a directory structure.

What's a convention-based Express route? It's a route that is dynamically generated and associated with a "controller" function without having to explicitly code the route yourself (i.e. you don't write code such as app.use('/foo', router)). express-convention-routes creates routes automatically by parsing a convention-based folder structure such as the one below when the server first starts.

```
-controllers
    -customers
        -customers.controller.js
    -api
        -cart
            -cart.controller.js
    -index.controller.js

```

This allows application routes to be created without having to write any app.use() code to define the individual routes. Using the previous folder structure, express-convention-routes would create the following routes (and associate them with the appropriate "controller" functions):

```
/customers
/api/cart   
/

```

Each folder contains a "controller" file that defines the functionality to run for the given route. For example, if you want a **root** route you'd add a file into the root **controllers** folder (**index.controller.js** for example). If you want an **api/cart** route you'd create that folder structure under the controllers folder (see the folder example above) and add a "controller" file such as **cart.controller.js** into the **api/cart** folder. You can name the controller files anything you'd like and they can have as many HTTP actions (GET/POST/PUT/DELETE, etc.) in them as you want.

To get started using the npm package, perform the following steps:

1. 1. Install the **express-convention-routes** package locally: `npm install express-convention-routes --save`
    2. Create a **controllers** folder at the root of your Express project.
    3. To create a root (/) route, add an **index.controller.js** file into the folder (you can name the file whatever you'd like). Put the following code into the file:
        
        ```
        
          module.exports = function (router) {
            router.get('/', function (req, res) {
                res.end('Hello from root route!');
            });
          };
        ```
        
    4. To create a **/customers** route, create a subfolder under controllers named **customers**.
    5. Add a **customers.controller.js** file into the **customers** folder (you can name the file anything you'd like):
        
        ```
        
          module.exports = function (router) {
            router.get('/', function (req, res) {
                res.end('Hello from the /customers route!');
            });
          };
        ```
        
    6. Once the routing folder structure is created, add the following code into your express server code (index.js, server.js, etc.) to load the routes automatically based on the folder structure in the "controllers" folder when the Express server starts:
        
        ```
        
          var express = require('express'),
              app = express(),
              router = require('express-convention-routes');
        
          router.load(app, {
            //Defaults to "./controllers" but showing for example
            routesDirectory: './controllers', 
        
            //Root directory where your server is running
            rootDirectory: __dirname,
            
            //Do you want the created routes to be shown in the console?
            logRoutes: true
          });
        ```
        
    7. Try out the included sample app by running the following commands:
        - `npm install`
        - `npm start`
    8. The sample app included with the package (see the [Github project](https://github.com/DanWahlin/express-convention-routes)) follows a feature-based approach where the controller and associated view are in the same folder (handlebars is used for the views in the sample). If you prefer the more traditional approach where all of the views live in the "views" folder you can simply move the .hbs files there into the proper folders.

I originally got the convention-based routes idea from ASP.NET MVC (as well as other MVC frameworks) and KrakenJS ([http://krakenjs.com](http://krakenjs.com)). These frameworks automate the process of creating routes so I wanted to do something similar with [express-convention-routes](https://www.npmjs.com/package/express-convention-routes) while keeping the dependencies as minimal as possible and the code as simple as possible.
