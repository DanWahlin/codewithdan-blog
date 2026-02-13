---
title: "10 Angular and TypeScript Projects to Take You From Zero to Hero"
date: 2017-02-08
categories: 
  - "angular"
  - "angular-2"
  - "asp-net"
  - "c"
  - "databinding"
  - "ecmascript6"
  - "es6"
  - "express"
  - "html5"
  - "javascript"
  - "mongodb"
  - "node-js"
  - "pluralsight"
  - "spa"
  - "transpile"
  - "typescript"
coverImage: "details_thumb-1.png"
---

There are a lot of great samples and posts out there to help get you started with Angular (version 2 or higher) as well as ES6/ES2015 and TypeScript. However, some are out of date, some may be more complex than you want to start with, and others have been abandoned and are no longer maintained. In this post I’m going to provide a list of 10 Angular/TypeScript projects that I’ve created that can take you from “Zero to Hero” if you like to explore project code and are interested in investing the time to learn.

The projects are listed in ![](/images/blog/10-angular-and-typescript-projects-to-take-you-from-zero-to-hero/angular.svg)order from beginner to intermediate/advanced level to show the sequence I’d recommend if you’d like to start out slow or jump to a more robust project. Many of these projects are used in my [**Angular and TypeScript Application Development**](https://www.codewithdan.com/products/angular-programming) instructor-led training course. I realize that not everyone can take the course which is why I’m listing the projects here to hopefully add value to the overall community.

On a related note, if you’re using the [VS Code editor](http://code.visualstudio.com/) (my preferred editor) check out my [Angular and TypeScript code snippets](https://blog.codewithdan.com/2016/08/30/angular-2-typescript-and-html-snippets-for-vs-code/) extension. The code snippets will save you a ton of time and significantly increase your productivity as you build Angular (v2 or higher) and TypeScript applications.

 

# Project 1: ES6/ES2015 Code Examples

 

| **Project URL:** | [https://github.com/DanWahlin/ES6Samples](https://github.com/DanWahlin/ES6Samples "https://github.com/DanWahlin/ES6Samples") |
| --- | --- |
| **Level:** | Beginner |
| **Description:** | This project provides an introductory look at key features available in ES6/ES2015 which are important given that TypeScript is a superset of ES6/ES2015 features. All of the Angular projects below use TypeScript so if you’re new to the TypeScript language or to what ES6/ES2015 offers I’d recommend learning those concepts first before diving into Angular concepts.  Note that some people call it ES6, some call it ES2015, which is why I’m listing both here. ES6 is the same as ES2015. [](https://blog.codewithdan.com/wp-content/uploads/2017/02/ES6-1.png) |

 

 

# Project 2: ES6/ES2015 Modules Example

 

| **Project URL:** | [https://github.com/DanWahlin/ES6-Modules-Starter](https://github.com/DanWahlin/ES6-Modules-Starter "https://github.com/DanWahlin/ES6-Modules-Starter") |
| --- | --- |
| **Level:** | Beginner |
| **Description:** | ES6/ES2015 modules play an important role in Angular (v2 or higher) applications so learning the basics about how modules work, how a module loader is configured, etc. is very important if you want to build Angular applications. This project provides a simple starter example of getting started with modules and the SystemJS module loader.  What is a module loader? Browser’s don’t support ES6/ES2015 modules quite yet so a “polyfill” script is needed to add-in the missing functionality. SystemJS is one of several module loaders out there that can be used to work with modules in browsers.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/ES6-modules-1.png) |

 

 

# Project 3: TypeScript Code Examples

 

| **Project URL:** | [https://github.com/DanWahlin/TypeScriptDemos](https://github.com/DanWahlin/TypeScriptDemos "https://github.com/DanWahlin/TypeScriptDemos") |
| --- | --- |
| **Level:** | Beginner |
| **Description:** | This project provides an introductory look at various features that are available in ES2015 and TypeScript. All of the Angular projects below use TypeScript so if you’re new to the language I’d recommend learning it first before diving into Angular concepts.  If you’d like more formal training on TypeScript you can also check out the [TypeScript Fundamentals](https://www.pluralsight.com/courses/typescript) video course that my good friend John Papa and I created for Pluralsight.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/typescript-1.png) |

 

 

# Project 4: Angular Hello World

 

| **Project URL:** | [https://github.com/DanWahlin/Angular-HelloWorld](https://github.com/DanWahlin/Angular-HelloWorld "https://github.com/DanWahlin/Angular-HelloWorld") |
| --- | --- |
| **Level:** | Beginner |
| **Description:** | The Angular Hello World project provides a simple starter project for people who are brand new to Angular (version 2 or higher) and TypeScript. It provides a basic look at the project structure, using package.json and npm to load Angular modules, as well as TypeScript compilation with tsconfig.json. The project only contains a single module and component so if you want to experiment with various Angular features in a simple environment then this project will work well for you.  **Bonus:** Although this is a very basic project, it provides support for Webpack and Angular’s [Ahead-of-Time](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html) (AOT) compilation feature which is a great way to speed up the load time and minimize the number of scripts loaded in the browser (and there are several other great benefits). The feature isn’t used by default but details can be found in the readme file if you’re interested in getting it going.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/HelloWorld-1.png) |

 

 

# Project 5: Angular Bare Bones

 

| **Project URL:** | [https://github.com/DanWahlin/Angular-BareBones](https://github.com/DanWahlin/Angular-BareBones "https://github.com/DanWahlin/Angular-BareBones") |
| --- | --- |
| **Level:** | Beginner |
| **Description:** | The Angular Bare Bones project takes things up a level from the Hello World project and adds basic Angular routing, multiple components as well as a simple service. It’s a good project for beginners to look through to see how many of the key features that Angular and TypeScript provide can be tied together while still keeping the code very simple overall.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/BareBones-1.png) |

# Project 6: Angular Template-Driven and Reactive Forms

 

| **Project URL:** | [https://github.com/DanWahlin/Angular-Forms](https://github.com/DanWahlin/Angular-Forms "https://github.com/DanWahlin/Angular-Forms") |
| --- | --- |
| **Level:** | Beginner/Intermediate |
| **Description:** | The Angular Forms project shows how to get started with data binding in forms using ngModel (template-driven approach) or the Reactive forms approach where form controls are defined in code and bound into the UI. Examples of custom validators are also included as well as examples of binding to different types of form controls and accessing submitted data.  If you’re interested in learning more about template-driven and reactive forms and how they can be used with a backend service, check out my [Integrating Angular with Node.js RESTful Services](https://www.pluralsight.com/courses/angular-nodejs-restful-services) course on Pluralsight.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/Forms-1.png) |

 

 

# Project 7: Angular JumpStart

 

| **Project URL:** | [https://github.com/DanWahlin/Angular-JumpStart](https://github.com/DanWahlin/Angular-JumpStart "https://github.com/DanWahlin/Angular-JumpStart") |
| --- | --- |
| **Level:** | Beginner/Intermediate/Advanced |
| **Description:** | The Angular JumpStart project provides a complete application that demonstrates many key features provided by the Angular framework. Some of the project features include:  - TypeScript classes and modules - Modules are loaded with System.js - Defining routes including child routes and lazy loaded routes - Using Custom Components including custom input and output properties - Using Custom Directives - Using Custom Pipes - Defining Properties and Using Events in Components/Directives - Using the Http object for Ajax calls along with RxJS observables - Working with Utility and Service classes (such as for sorting and Ajax calls) - Using Angular databinding Syntax \[\], () and \[()\] - Using template-driven and reactive forms functionality for capturing and validating data - Optional: Webpack functionality is available for module loading and more (see the readme for details) - Optional: Ahead-Of-Time (AOT) support is available (see the readme for details) - Much more!  This is one of the key projects used in our [**Angular and TypeScript Application Development**](https://www.codewithdan.com/products/angular-programming) instructor-led training class.     [](https://blog.codewithdan.com/wp-content/uploads/2017/02/cards-1.png)     [](https://blog.codewithdan.com/wp-content/uploads/2017/02/details-1.png)     [](https://blog.codewithdan.com/wp-content/uploads/2017/02/orders-1.png) |

 

 

# Project 8: Angular, Node.js RESTful Services and MongoDB

 

| **Project URL:** | [https://github.com/DanWahlin/Angular-NodeJS-MongoDB-CustomersService](https://github.com/DanWahlin/Angular-NodeJS-MongoDB-CustomersService "https://github.com/DanWahlin/Angular-NodeJS-MongoDB-CustomersService") |
| --- | --- |
| **Level:** | Beginner/Intermediate |
| **Description:** | This project shows how Angular can be used to integrate with a Node.js RESTful service that uses MongoDB as the backend database. The application relies on an Angular service that can perform CRUD (create, read, update and delete) operations and also demonstrates using both template-driven and reactive forms. Observables and RxJS play a key role in the async operations that the application performs.  The project can be run locally or using Docker containers. For more information on the concepts covered in this project, check out my [Integrating Angular with Node.js RESTful Services](https://www.pluralsight.com/courses/angular-nodejs-restful-services) course on Pluralsight.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/Angular-Node1-1.png)  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/Angular-Node2-1.png) |

 

 

# Project 9: Docker, Angular, Node.js RESTful Services and MongoDB

 

| **Project URL:** | [https://github.com/DanWahlin/Angular-RESTfulService](https://github.com/DanWahlin/Angular-RESTfulService "https://github.com/DanWahlin/Angular-RESTfulService") |
| --- | --- |
| **Level:** | Beginner/Intermediate |
| **Description:** | This is another project that shows how Angular can be used to integrate with a Node.js RESTful service that uses MongoDB as the backend database. This particular project relies on Docker and Docker Compose to startup the Node.js and MongoDB containers used to run the application.  For more information on the Docker or Angular concepts covered in this project, check out my [Docker for Web Developers](https://www.pluralsight.com/courses/docker-web-development) or [Integrating Angular with Node.js RESTful Services](https://www.pluralsight.com/courses/angular-nodejs-restful-services) courses on Pluralsight.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/Angular-Node-Docker-1.png) |

 

 

# Project 10: Docker, Angular, ASP.NET Core RESTful Services and PostgreSQL

 

| **Project URL:** | [https://github.com/DanWahlin/AspNetCorePostgreSQLDockerApp](https://github.com/DanWahlin/AspNetCorePostgreSQLDockerApp "https://github.com/DanWahlin/AspNetCorePostgreSQLDockerApp") |
| --- | --- |
| **Level:** | Beginner/Intermediate |
| **Description:** | This project shows how Angular can be used to integrate with an ASP.NET Core RESTful service that uses PostgreSQL as the backend database. The application is designed to be run using Docker containers and started up using Docker Compose.  For more information on the Docker or Angular concepts covered in this project, check out my [Docker for Web Developers](https://www.pluralsight.com/courses/docker-web-development) or [Integrating Angular with Node.js RESTful Services](https://www.pluralsight.com/courses/angular-nodejs-restful-services) courses on Pluralsight.  [](https://blog.codewithdan.com/wp-content/uploads/2017/02/Angular-ASPNET-1.png) |
