---
title: "Creating a TypeScript Workflow with Gulp"
date: 2015-03-23
categories: 
  - "net"
  - "angularjs"
  - "gulp"
  - "javascript"
  - "jquery"
  - "typescript"
---

TypeScript provides a lot of great functionality that lets you leverage many of the features available in ES6 today but how do you get started using it in your favorite editor? If you’re using Visual Studio or WebStorm then TypeScript support can be used directly and everything happens magically without much work on your part. But, if you’re using Sublime Text, Brackets, Atom, or another editor you’ll have to find a plugin to compile .ts files to JavaScript or create your own custom workflow.

While several plugins exist to compile TypeScript and even provide code help as you’re writing TypeScript code in different editors, I generally prefer to use my own custom workflow. There are multiple benefits associated with going with this approach including the ability to standardize and share tasks across team members as well as being able to tie the workflow into a custom build process used in continuous integration scenarios. In this post I’ll walk through the process of creating a custom TypeScript workflow using [Gulp](http://gulpjs.com/) (a JavaScript task manager). It’s a workflow setup that my friend [Andrew Connell](https://twitter.com/andrewconnell) and I created when we recently converted an [application](https://github.com/DanWahlin/AngularTypeScript) to TypeScript. Throughout the post you’ll learn how to setup a file named gulpfile.js to compile TypeScript to JavaScript and also see how you can “lint” your TypeScript code to make sure it’s as clean and tidy as possible.

## Getting Started Creating a Custom TypeScript Workflow

I talked about using Gulp to automate the process of transpiling ES6 to ES5 in a [previous post](http://weblogs.asp.net/dwahlin/getting-started-with-es6-%E2%80%93-transpiling-es6-to-es5). The general process shown there is going to be used here as well although I’ll be providing additional details related to TypeScript. If you’re new to Gulp, it’s a JavaScript task manager that can be used to compile .ts files to .js files, lint your TypeScript, minify and concatenate scripts, and much more. You can find additional details at [http://gulpjs.com](http://gulpjs.com/).

Here’s a step-by-step walk-through that shows how to get started creating a TypeScript workflow with Gulp. Although there are several steps to perform, it’s a one-time setup that can be re-used across projects. If you’d prefer to use a starter project rather than walking through the steps that are provided in this post then see the project at [https://github.com/DanWahlin/AngularIn20TypeScript](https://github.com/DanWahlin/AngularIn20TypeScript) or download the project associated with the exact steps shown in this post [here](https://dl.dropboxusercontent.com/u/6037348/TypeScript/typescriptGulpWorkflow.zip).

### Creating the Application Folders and Files

1. Create a new folder where your project code will live. You can name it anything you’d like but I’ll call it **typescriptDemo** in this post.
2. Create the following folders inside of **typescriptDemo**:
    - **src**
    - **src/app**
    - **src/js**
3. Open a command-prompt in the root of the **typescriptDemo** folder and run the following **npm** command (you’ll need to have [Node.js](http://nodejs.org/) installed) to create a file named **package.json**.

**npm init**

 

- Answer the questions that are asked. For this example you can go with all of the defaults it provides. After completing the wizard a new file named **package.json** will be added to the root of the folder.
- Create the following files in the **typescriptDemo** folder:

 

- **gulpfile.js**
- **gulpfile.config.js**
- t**slint.json**

 

### Installing Gulp, Gulp Modules and TSD[](https://aspblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/1aaa3d08d14c_14AAE/image_2.png)

1. Now let’s get **Gulp** installed globally on your machine. Open a command-prompt and run the following command:

**npm install gulp –g**

 

- Open **package.json** and add the following **devDependencies** property into it. The location of the property in the file doesn’t really matter but I normally put it at the bottom. A sample **package.json** file with the dependencies already in it can be found at [https://github.com/DanWahlin/AngularIn20TypeScript](https://github.com/DanWahlin/AngularIn20TypeScript).

 

**Note:** The module versions shown here will certainly change over time. You can visit [http://npmjs.org](http://npmjs.org) to find the latest version of a given module.

```
"devDependencies": { 
    "gulp": "^3.8.11", 
    "gulp-debug": "^2.0.1", 
    "gulp-inject": "^1.2.0", 
    "gulp-sourcemaps": "^1.5.1", 
    "gulp-tslint": "^1.4.4", 
    "gulp-typescript": "^2.5.0", 
    "gulp-rimraf": "^0.1.1" 
}
```

 

- Ensure that your command window path is at the root of the **typescriptDemo** folder and run the following command to install the dependencies:**npm install**
- The [http://definitelytyped.org](http://definitelytyped.org) site provides a Node.js module named **tsd** that can be used to install TypeScript type definition files that are used to provide enhanced code help in various editors. Install the **tsd** module globally by running the following command:**npm install tsd@next -g**
- Run the following command:**tsd init**
- Open the tsd.json file that is generated in the root of **typescriptDemo** and change the following properties to include “tools” in the path as shown next:**"path": "tools/typings",** **"bundle": "tools/typings/tsd.d.ts"** 
- Let’s use **tsd** to install a TypeScript definition file for Angular (an angular.d.ts file) and update the **tsd.json** file with the Angular file details as well. Run the following command:

 

**tsd install angular --save**

**Note:** You can install additional type definition files for other JavaScript libraries/frameworks by running the same command but changing the name from “angular” to the appropriate library/framework. See [http://definitelytyped.org/tsd](http://definitelytyped.org/tsd) for a list of the type definition files that are available.

 

- Let’s now install the jQuery type definition as well since the Angular type definition file has a dependency on it:**tsd install jquery --save**
- If you look in the **typescriptDemo** folder you’ll see a new folder is created named **tools**. Inside of this folder you’ll find a file named **typings** that has an **angular/angular.d.ts** type definition file and a **jquery/jquery.d.ts** file in it. You’ll also see a file named **tsd.json**.
- Create a file named **typescriptApp.d.ts** in the **typescriptDemo/tools/typings** folder. This file will track all of the TypeScript files within the application to simplify the process of resolving dependencies and compiling TypeScript to JavaScript.
- Add the following into the **typescriptApp.d.ts** file and save it (the comments are required for one of the Gulp tasks to work properly):

 

> **//{**
> 
>  
> 
> **//}**

### Creating Gulp Tasks

1. Open [https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/gulpfile.config.js](https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/gulpfile.config.js) in your browser and copy the contents of the file into your empty **gulpfile.config.js** file. This file sets up paths that will be used when performing various tasks such as compiling TypeScript to JavaScript.
2. Open [https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/gulpfile.js](https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/gulpfile.js) in your browser and copy the contents of the file into your empty **gulpfile.js** file. This creates the following Gulp tasks:**gen-ts-refs**: Adds all of your TypeScript file paths into a file named **typescriptApp.d.ts**. This file will be used to support code help in some editors as well as aid with compilation of TypeScript files.

**ts-lint**: Runs a “linting” task to ensure that your code follows specific guidelines defined in the tsline.js file.

**compile-ts:** Compiles TypeScript to JavaScript and generates source map files used for debugging TypeScript code in browsers such as Chrome.

**clean-ts:** Used to remove all generated JavaScript files and source map files.

**watch:** Watches the folder where your TypeScript code lives and triggers the ts-lint, compile-ts, and gen-ts-refs tasks as files changes are detected.

**default:** The default Grunt task that will trigger the other tasks to run. This task can be run by typing **gulp** at the command-line when you’re within the **typescriptDemo** folder.

1. Open [https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/tslint.json](https://github.com/DanWahlin/AngularIn20TypeScript/blob/master/tslint.json) in your browser and copy the contents of the file into your empty **tslint.js** file. This has the “linting” guidelines that will be applied to your code. You’ll more than likely want to tweak some of the settings in the file depending on your coding style.

### Compiling TypeScript to JavaScript

1. Now that the necessary files are in place (whew!), let’s add a test TypeScript file into the application folder and try to compile it to JavaScript. Create a file named **customer.ts** in the **typescriptDemo/src/app** folder.
2. Add the following code into the **customer.ts** file:
    
    ```
    class Customer {
        name: string;
    
        constructor(name: string) {
            this.name = name;
        }
    
        getName() {
            return this.name;
        }
    }
    
    ```
    
     
3. Run the following command in your command window (run it from the root of the **typescriptDemo** folder):**gulp**
4. You should see output that shows that the tasks have successfully completed.
5. Open the **src/js** folder and you should that two new files named **customer.js** and **customer.js.map** are now there.
6. Go back to **customer.ts** and change the case of the **Customer** class to **customer**. Save the file and notice that the gulp tasks have run in the command window. You should see a **tslint** error saying that the case of the class is wrong.
7. Your Gulp/TypeScript workflow is now ready to go.

## Conclusion

In this post you’ve seen the steps required to create a custom TypeScript workflow using the Gulp JavaScript task runner. Although you may certainly want to tweak some of the settings and tasks, the steps shown here should help get you started using TypeScript in your applications.

In case you missed it earlier in the post, a project that has all of the steps already completed can be found at [https://github.com/DanWahlin/AngularIn20TypeScript](https://github.com/DanWahlin/AngularIn20TypeScript). You can also find the exact setup discussed in this post [here](https://dl.dropboxusercontent.com/u/6037348/TypeScript/typescriptGulpWorkflow.zip) (just run **npm install** to get the required modules for the project).
