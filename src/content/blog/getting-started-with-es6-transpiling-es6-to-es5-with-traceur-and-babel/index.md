---
title: "Getting Started with ES6 – Transpiling ES6 to ES5 with Traceur and Babel"
date: 2014-12-16
categories: 
  - "babel"
  - "ecmascript6"
  - "es6"
  - "gulp"
  - "javascript"
  - "node-js"
  - "traceur"
  - "transpile"
---

In the [first post](https://weblogs.asp.net/dwahlin/getting-started-with-es6-%E2%80%93-the-next-version-of-javascript) in this series I introduced key features in ECMAScript 6 (ES6), discussed tools that can be used today to transpile code to ES5 so that it can work in today’s browsers, and listed several resources that will help get you started. Before jumping into the first official ES6 feature (that’s coming in the next post) I wanted to write a step-by-step walkthrough that covers how to get the [Traceur](https://github.com/google/traceur-compiler) and [Babel](https://babeljs.io/) transpilers working with [Gulp](http://gulpjs.com/) (a JavaScript task runner). I’m also going to sneak in a little TypeScript as well since it’s another option. By getting these tools in place you can start writing ES6 code, convert/transpile it to ES5, and then use the generated code in older browsers. Going that route lets you take advantage of the future of JavaScript right now without having to wait around until all of the browsers fully support ES6.[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/2272876fb5e4_BAB3/image_8.png)

Two options are available in this post. If you want a step-by-step look at getting Gulp setup to work with ES6 transpilers then I’d recommend reading the entire post. If you want to start working with ES6 but aren’t interested in getting the ES6 transpilers setup then skip to the **Configuring ES6 Samples** section below where you can download a project that has everything in place and discusses how to get started using it.

Let’s jump into a step-by-step walk-through of setting up Gulp, Traceur and Babel.

## Installing Node.js and Gulp

  
Transpilers such as [Traceur](https://github.com/google/traceur-compiler) and [Babel](https://babeljs.io/) can be run directly from the command line which makes it fairly trivial to convert ES6 code to ES5. However, after performing a command-line task a few times you’ll begin to wonder if there’s a way to automate the process. The good news is that JavaScript task runner tools such as [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/) can automate just about any JavaScript task you can think of. You can use them to perform a variety of tasks such as restarting a Node.js server if it dies, “live” reloading a webpage as HTML or CSS code changes, concatenating and minifying JavaScript files, finding unused CSS classes in a file, plus much more. You can also use these tools to automatically convert ES6 code to ES5 as you save a code file.

While both tools get the job done well, I personally prefer Gulp so the steps that follow will show how to use it. I’m going to assume that you haven’t done much with Node.js or Gulp so if you’re already a Node.js or Gulp expert you can gloss over some of the steps that follow. Let’s get started by getting Node.js and Gulp installed.

### Step 1: Install Node.js

  
Gulp requires [Node.js](http://nodejs.org) so the first thing you’ll need to do (if you haven’t done it already) is install Node.js on your machine. Navigate to [http://nodejs.org](http://nodejs.org) in the browser and click the **Install** button to download the Node.js installation file.  
  

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/2272876fb5e4_BAB3/image_2.png)  
  

Once the file downloads, double-click it and follow the instructions to install Node.js on your machine.

  
 

### Step 2: Use npm to Install Gulp

  
When you install Node.js you also get access to another tool called [npm](https://www.npmjs.com/) that can be used to install Node.js modules. Gulp is one of many modules that are available (see [https://www.npmjs.com](https://www.npmjs.com) for a complete list).  Follow these steps to use npm to install Gulp.

  
**Note for Mac Users**: You may need to add “sudo” in front of the install commands below if they fail. If you don’t want to use sudo (for security reasons) check out [this post](http://howtonode.org/introduction-to-npm).

1. Create the following folder structure on your desktop (or anywhere else you’d like to create it):  
      
    [](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/2272876fb5e4_BAB3/image_10.png)  
      
    
2. Open a command-prompt and navigate to the **es6Demos** folder.  
      
    
3. Type the following at the command-prompt:  
      
    **npm init  
      
    **
4. Running this command will start a command-line wizard that’s used to generate a file named **package.json**.  
      
    
5. Accept all of the defaults for now (or you can supply values for the author name, description, etc. if you’d like) by pressing Return/Enter for each question asked.  
      
    
6. At the end of the wizard you’ll be asked to type “yes” to complete the process. The **package.json** file that’s generated is used to store all of the modules that your app may use (such as Gulp and others).  
      
    
7. Type the following at the command-prompt to install the Gulp module globally on your machine:  
      
    **npm install gulp -g  
      
      
    **
8. Next type the following at the command-prompt to add Gulp to your **package.json** file’s dev dependencies. This will cause the **package.json** file to be updated and add a **node\_modules** folder into the **es6Demos** folder that contains Gulp-related code/files.  
      
    **npm install gulp --save-dev  
    **
9. To try out Gulp, type the following at the command-prompt and press Enter/Return. You should see an error saying that no gulpfile was found.  
      
    **gulp  
    **  
      
    

### Step 3: Install Traceur, Babel, and Additional Gulp Modules

  
Now that Node.js and Gulp are available it’s time to load the **Traceur** and **Babel** Gulp modules so that we can use them to transpile ES6 code to ES5. In a “real” app you’d choose one of these rather than using both at the same time, but you’ll configure both here so that you can see the type of ES5 code that they generate.

I’m going to show the entire process for getting Gulp modules in place. At the end of the steps I’ll show how simple it is to get everything going using npm and the package.json file though so that in the future this process is super quick.

1. Run the following commands at the command-prompt (it should still be at the **es6Demos** folder) to install Gulp modules (and some others) that can be used to transpile ES6 to ES5. As mentioned above, I’m showing how to install each individual Gulp module so that you understand the process. It’s a one-time setup process and can be re-used once in place as you’ll see at the end of this section.  
      
    **npm install gulp-babel --save-dev  
    npm install gulp-traceur --save-dev  
    npm install gulp-typescript --save-dev  
    npm install gulp-plumber --save-dev  
    npm install gulp-concat --save-dev  
    npm install gulp-uglify --save-dev  
    **  
    Although the gulp-plumber, gulp-concat, gulp-typescript, and gulp-uglify modules are optional, they’re quite useful in a real-life workflow. The gulp-plumber module can help fix errors that occur in the Gulp pipeline while gulp-concat and gulp-uglify can be used to concatenate and minify JavaScript files to get them ready for production. I won’t focus on them in this post but they’re good to have in place and use once you’re ready to move files into production.  
      
    
2. Open the **package.json** file that’s in the **es6Demos** folder in a text editor and notice that a **devDependencies** property has been added along with details about each module that you installed earlier including their version number. The file should look something like the following (note that I removed a few properties that aren’t needed in the code below):  
      
    
    ```
    {
      "name": "ES6Demos",
      "version": "1.0.0",
      "description": "",
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "gulp": "^3.8.10",
        "gulp-babel": "^4.0.1",
        "gulp-concat": "^2.4.2",
        "gulp-plumber": "^0.6.6",
        "gulp-traceur": "^0.14.1",
        "gulp-typescript": "^2.3.0",
        "gulp-uglify": "^1.0.2"
      }
    }
    ```
    
3. Open the **node\_modules** folder and notice the subfolders that are there now.

  
 

### Step 4: Creating a gulpfile

  
Now that all of the necessary modules are in place it’s time to create a Gulp task runner file name **gulpfile.js**. This file is responsible for defining tasks that use the Gulp modules installed earlier such as Traceur and Babel.  
  

1. Create a new file in the **es6Demos** folder named **gulpfile.js**.  
      
    
2. Add the following code into **gulpfile.js** to load the Gulp modules installed earlier and define a few paths:  
      
      
    
    ```
    var gulp = require('gulp'),
        traceur = require('gulp-traceur'),
        babel = require('gulp-babel'),
        plumber = require('gulp-plumber'),
        es6Path = 'es6/*.js',
        compilePath = 'es6/compiled';
    ```
    
3. Now add the following code under the code in the previous step to create a new **Traceur** task. This adds the plumber module into the streaming process to handle any errors that occur in the the piping process more gracefully and then invokes the **Traceur** transpiler. The blockBinding property allows block level definitions to be used in the ES6 code via a new _let_ keyword (more about that feature in a future post).  
      
      
    
    ```
    gulp.task('traceur', function () {
        gulp.src([es6Path])
            .pipe(plumber())
            .pipe(traceur({ blockBinding: true }))
            .pipe(gulp.dest(compilePath + '/traceur'));
    });
    ```
    
4. Now add code to create a **Babel** task:  
      
      
    
    ```
    gulp.task('babel', function () {
        gulp.src([es6Path])
            .pipe(plumber())
            .pipe(babel())
            .pipe(gulp.dest(compilePath + '/babel'));
    });
    ```
    
5. The previous tasks will cause ES6 to be transpiled to ES5 (using two different techniques) but they won’t run any time an ES6 file is saved. To automate the process add the following watch task:  
      
      
    
    ```
    gulp.task('watch', function() {
    
        gulp.watch([es6Path], ['traceur', 'babel']);
    
    });
    
    ```
    
6. Finally, create a default task that runs the **traceur**, **babel**, and **watch** tasks when you first start Gulp:  
      
      
    
    ```
    gulp.task('default', ['traceur', 'babel', 'watch']);
    ```
    
7. Save **gulpfile.j**s and run the following command again at the command-prompt:  
      
    **gulp  
      
    **
8. The Gulp tasks should now run and the console should display output about the tasks.  
    
9. Leave the console up and running and continue to the next section.

  
 

## Transpiling ES6 to ES5

  
Now that you have Gulp up and running and the Traceur and ES6 tasks in place it’s time to transpile ES6 to ES5.

1. Add a new file named **car.js** into the **es6** folder.  
      
    
2. Add the following code into **car.js**. I’ll be discussing this code in a future post but in a nutshell, ES6 now supports encapsulating code by using classes.  
      
      
    
    ```
    class Car {
        
        constructor(engine) {
            this.engine = engine;
        }
    
    }
    ```
    
3. Open the **es6/compiled/traceur** folder and open the **car.js** file. It will have the following ES5 code in it:  
      
      
    
    ```
    "use strict";
    var Car = function Car(engine) {
      this.engine = engine;
    };
    ($traceurRuntime.createClass)(Car, {}, {});
    ```
    
      
      
    
4. The **car.js** file in **es6/compiled/babel** has the following ES5 code:  
      
      
    
    ```
    "use strict";
    
    var Car = function Car(engine) {
      this.engine = engine;
    };
    ```
    
5. You’ve now successfully transpiled ES6 code to ES5 using both Traceur and Babel.

  
 

## Configuring the ES6 Samples

  
If you decided to skip all of the steps above you can visit [http://github.com/danwahlin/es6samples](http://github.com/danwahlin/es6samples) and click the  **Download ZIP** button to get all of the code (or clone the repository if you’re familiar with Git). Once you have the code extracted follow the steps below to get Gulp and the transpilers setup.

Note that if you’re on a Mac you may need to use “sudo” (prefix each of the npm commands with it) if any of the install commands trigger an error.

1. Install **Node.js** if it’s not already on your system.  
      
    
2. Open a command-prompt and navigate to the project’s root folder that has the **package.json** file in it.  
      
    
3. If you haven’t already installed **Gulp** run the following command:  
      
    **npm install gulp -g  
      
    **
4. Run **npm install** to get the necessary Node.js/Gulp modules installed.  
      
    
5. Run the following command to transpile the JavaScript files from ES6 to ES5 and start the file watcher:  
      
    **gulp  
      
    **
6. Open the **es6/compiled** folder and look at the files that are generated in the two subfolders (traceur and babel).

  
 

## Conclusion

  
Transpilers such as Traceur and Babel provide a way to convert ES6 code to ES5 quickly and easily. In this post you’ve seen a step-by-step walk-through of setting up the Gulp task runner to automate the transpilation process and how it can simplify the overall process of converting ES6 code and ES5. Now that the setup work for transpiling files is in place it’s time to jump into some of the different ES6 features that are available. Stay tuned for future posts.

  
  
**Onsite Developer Training:** If your company is interested in onsite training on JavaScript, ES6, AngularJS, Node.js, C# or other technologies please email [training@wahlinconsulting.com](mailto:training@wahlinconsulting.com) for details about the classes that we offer.
