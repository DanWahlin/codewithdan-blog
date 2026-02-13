---
title: "5 Key Benefits of Angular and TypeScript"
date: 2017-08-26
categories: 
  - "angular"
  - "es6"
  - "framework"
  - "javascript"
  - "spa"
  - "typescript"
coverImage: "5-key-benefits-angular-typescript.jpg"
---

 

[![](/images/blog/5-key-benefits-of-angular-and-typescript/5-key-benefits-angular-typescript.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/08/5-key-benefits-angular-typescript.jpg)Over the past few months, I've been asked the same general question about Angular multiple times in [onsite training classes](https://www.codewithdan.com/products/angular-programming), while helping customers with their architecture, or when talking with company leaders about the direction web technologies are heading. Here's the general question:

### **"What are the key benefits that Angular and TypeScript can offer our development teams?"**

It's a great question and one that should be asked before jumping into any new technology or framework. Most of the people asking are technology managers or directors interested in understanding the benefits that Angular can offer their teams (both technical and non-technical). They're concerned about application maintenance, developer productivity, handling change requests, the longevity of the framework, the pace of technology, and more.

After hearing that general question over and over I decided it was time to put together a post that outlines my top 5 reasons for using Angular and TypeScript. There are certainly **MANY** others I could list, but here are my top 5 benefits:

1. Consistency
2. Productivity
3. Maintainability
4. Modularity
5. Catch Errors Early

Before continuing I do want to mention that while I do work with Angular a lot (and enjoy it), I’m not a “one framework” type of guy. Why? Because if there’s one thing I’ve learned in life it’s that one size never fits all. When someone suggests that one technology or framework is \*always\* the best option I like to say, “Walk into a shoe store and say that you want to try on a pair of shoes. When they ask you what size you'd like, tell them it doesn’t matter and see how that goes.” One size doesn’t fit all in shoes - or in technology.

My company ([Wahlin Consulting](https://codewithdan.com)) works with a lot of large and small companies and some are using AngularJS 1.x, some have moved to Angular v2+, some are using React, others are exploring Vue.js (and others), and a few are still using jQuery. This post is geared toward those who are considering Angular and TypeScript. If you're not interested in Angular/TypeScript then this post probably isn't for you.

Let's get started with benefit #1.

## Consistency

Code consistency is an important goal to strive for in any code base. If you or your team have to support production applications then you understand how important consistency is and why it leads to better maintenance. So what does Angular offer that provides consistency for teams? The overall framework is based on components and services that you can think of as Lego blocks. All components and services start out the same way. For example, all Angular components do the following:

1. Import required ES2015 modules
2. Define a @Component decorator (metadata)
3. Place code in a component class

Here's a visual showing how that works:

![](/images/blog/5-key-benefits-of-angular-and-typescript/2017-08-26_13-28-38.png)

Regardless of what component you're writing, this overall structure is always followed. Sure, there are additional things you can add (implement an interface such as OnInit or others if using TypeScript, put templates inline versus in a separate file, and many others), but the overall structure of a component always looks the same. That's a good start and provides consistency as team members start out building components.

Another big area of consistency in Angular is with services. AngularJS 1.x let you choose between factories, services, providers, values and constants when you have code that needs to be reused throughout an application. Some developers prefer factories while others lean toward services. They both do the same thing overall but which one is the "right one"? The answer is that it's quite subjective. Unless a team agrees on a coding style for team members, each developer goes off and does their own things...something I've always called "cowboy coding" (no offense to any cowboys out there :-)).

Fortunately, Angular makes deciding how to add re-usable code into an application quite simple. Everything in that scenario is simply a service class:

```

import { Injectable } from '@angular/core';
import { MyDependency } from './mydependency.service';

@Injectable()
class MyService {
   constructor(private myDependency: MyDependency) {}
}
```

Any dependencies that the service requires can be "injected" into its constructor as shown in the code sample above (the dependency must have a [provider registered](https://angular.io/guide/dependency-injection) for this to work). This is another area where consistency is great. While components, services, and other types can certainly create instances of the objects they need, Angular provides built-in dependency injection that will inject the objects at runtime. This not only provides consistency across an application but also allows injected objects to be overridden if needed which can be useful in many scenarios.

The Angular documentation also provides a [style guide](https://angular.io/guide/styleguide) that teams can use as a starting point to help drive consistency across projects. If I'm a director, manager, team lead or simply in charge of ensuring consistency across a team, I'm investing the necessary time to create a team-specific style guide for any framework used.

Finally, [Angular provides a CLI tool](https://cli.angular.io/) that can be used to create initial projects, add different features into an application (components, services, etc.), run tests, perform builds, lint code, and more. This provides a great foundation for teams to build on to drive consistency across team members and even across multiple teams in an enterprise.

The bottom line is that the consistency found in Angular components, services, pipes, directives and more allows a team to swim with the current rather than feeling like they're always swimming upstream against the current.  That leads quite nicely into the next benefit - productivity.

## Productivity

Consistency brings productivity into the picture as well. Developers don't have to worry as much about if they're doing it the "right way". Components and services look the same overall, reusable application code is put in service classes, ES6/ES2015 modules organize related functionality and allow code to be self-contained and self-responsible, data is passed into components using input properties and can be passed out using output properties, etc.

With greater consistency, you get the added benefit of productivity. When you learn how to write one component you can write another following the same general guidelines and code structure. Once you learn how to create a service class it's easy to create another one. It's like a broken record consistently spinning round and round that feels like many other frameworks you may have used in the past. Combine all of this with the [Angular CLI](https://cli.angular.io/), code snippets that the team creates ([or use mine](https://blog.codewithdan.com/2016/08/30/angular-2-typescript-and-html-snippets-for-vs-code/) if you use [VS Code](http://code.visualstudio.com)) and you're consistent and productive.

![](/images/blog/5-key-benefits-of-angular-and-typescript/2017-08-26_19-34-18.png)

If you use TypeScript to build your Angular applications then you also get several productivity benefits. In editors like [VS Code](https://code.visualstudio.com/) and [WebStorm](https://www.jetbrains.com/webstorm/specials/webstorm/webstorm.html) , you have access to robust code help(intellisense) as you type making it easier to discover types and the features they offer. If you use TypeScript interfaces, you can even get code help against the JSON data that comes back from calls to a back-end service. This is extremely helpful when various data/model objects are being used and manipulated by developers. TypeScript isn't only for Angular of course (you can use it with React, AngularJS, Vue.js, Node.js and any other JavaScript libraries/frameworks), but it integrates with Angular quite well.

## Maintainability

I love open source projects but am also sensitive to the fact that some people or groups running a project get tied up with other aspects of life and projects stop being maintained on occasion. If you've worked with OSS projects very long you know the story there. Anytime I consider using a project I look at the number of contributors, the last time it was updated and scan through the issues to see if they're being handled with regularity. I try really hard to only use and recommend projects, modules, libraries, etc. that are actively supported so that my projects and my customers' projects are easier to maintain and easier to keep up-to-date down the road.

Having a dedicated team at Google building Angular combined with the open source contributions from the community is a HUGE selling point for me personally. In today's "flavor of the day" world of JavaScript you never know what is going to be around tomorrow of course, so having that solid foundation backing the framework gives me more confidence. The fact that Google uses Angular quite heavily inside of the company for applications is another bonus. Many will say that the same could be said for React too....and they'd be correct. But, this post is focused on Angular.

You may be thinking, "But Dan - the jump from AngularJS 1.x to Angular 2+ was huge and definitely not good when it came to maintaining our existing app!" Yes, that's a valid point - even with ng-upgrade options. The jump between AngularJS and Angular was a direct result of the JavaScript language making huge gains forward with ES6/ES2015 functionality, combined with new features that modern browsers can now support. Had the Angular team NOT made that jump we'd be calling Angular the "Caveman Framework" in no time at all since it wouldn't be leveraging the latest and greatest features that can help with performance, consistency, productivity, maintainability and overall development. It was a move that I'm glad the Angular team made. I don't have a crystal ball (if anyone has one I'd be interested in borrowing it), but I do know that the Angular team is very aware of how framework changes affect enterprise projects (Angular is used a lot inside of Google). Based on what I've heard from the team I'm confident that they'll provide a smooth road going forward as new versions are released.

In addition to the solid backing Angular has going for it behind the scenes with the Angular team, when you add in the consistency features mentioned earlier you also get code that will be easier to maintain in production. I've had production support responsibilities for many years in my career (used to have a good old pager back in the day) so I'm really sensitive to being able to write code that is consistent and easy to maintain. With the proper style guide, training, and knowledge, a team can take any framework and create a consistent way of developing applications of course. That's true not only Angular but for many other frameworks out there as well I realize. But, Angular provides a very clear path for writing code as mentioned earlier in the "consistency" section which ultimately leads to simplified maintenance. If Jim or Jane goes on vacation (or changes jobs), Victor can step in and fix bugs that are found or handle change requests with confidence.

Angular code can be built using TypeScript (my preference) which provides a host of benefits, especially in the enterprise. See the "Catch Errors Early" section below for my thoughts on TypeScript and some of the maintenance benefits it brings to the table.

Whether your team does your own production support or hands it off to another group, being able to build applications that are consistent, easy to maintain, and that use a framework backed by a full-time development team combined with a robust open source community is a key priority for most enterprises.

## Modularity

![](/images/blog/5-key-benefits-of-angular-and-typescript/bucket.png)

Angular is all about organizing code into "buckets". Everything you create whether it's components, services, pipes, or directives has to be organized into one or more buckets. If you come from a  "function spaghetti code" background in your organization, the sanity that Angular and TypeScript bring to the table can be quite refreshing. The "buckets" I refer to are called "modules" in the Angular world. They provide a way to organize application functionality and divide it up into features and reusable chunks. Modules also offer many other benefits such as lazy loading as well where one or more application features are loaded in the background or on-demand.

Enterprise applications can grow quite large and the ability to divide the labor across multiple team members while keeping code organized is definitely achievable with Angular. Modules can be used to add organization into an application much like packages and namespaces do in other languages/frameworks like Java or .NET. I'll admit that a solid understanding of Angular modules and the way they can be used is crucial in order to use them successfully. However, once a team architects modules appropriately they can reap the benefits when it comes to the division of labor, code consistency, productivity, and maintenance.

## Catch Errors Early

[![](/images/blog/5-key-benefits-of-angular-and-typescript/oops-sign.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/08/oops-sign.jpg)Angular is built using TypeScript which brings many benefits to the table such as:

- TypeScript is a **superset** **of JavaScrip**t.TypeScript is not its own stand-alone language like CoffeeScript, Dart or others and that's super powerful. That means I can take existing ES5 or ES2015+ JavaScript code, plug it into a TypeScript .ts file (or even work with the .js file directly) and the code will work fine. TypeScript simply compiles/transpiles code down to ES5 or ES2015 depending on what you configure.
- TypeScript supports core ES2015 features as well as ES2016/ES2017 features like decorators, async/await and others. I like to think of it as ES2015++. See supported features at [http://kangax.github.io/compat-table/es6](http://kangax.github.io/compat-table/es6).
- TypeScript provides support for types (primitives, interfaces, and other custom types). Yes - there's a reason TypeScript has the word "Type" in its name. Although types are optional, they're highly recommended if you want to catch errors early on in the development lifecycle especially with larger applications. They make it much easier to see when something is passed or used incorrectly.
- TypeScript code can be debugged directly in the browser (or in an editor) as long as the proper map files are created during build time.
- TypeScript allows you to use classes and/or functional programming techniques. You're not limited to one way of doing things and can opt-out of any TypeScript specific features.

I could list many other features (visit [TypeScript's site](http://www.typescriptlang.org/docs/home.html) for more), but ultimately, the Angular framework is built using TypeScript and if you use it in your projects (which I highly recommend) then you can catch errors early in the development lifecycle or while performing maintenance tasks. When it comes to enterprise applications, TypeScript offers "guard rails" for your JavaScript code to ensure that developers and teams don't go "off the cliff" as they're building applications.

In addition to the benefits TypeScript offers, Angular is also built with testability in mind. The [Angular CLI](https://cli.angular.io) makes the process of unit testing and end-to-end testing a snap (it relies on Karma and Jasmine by default for unit tests but you can use whatever testing tools you'd like). Simply type **ng test** at the command line and any tests in the project will run. The **ng generate** command will automatically generate a spec file for you as you create a component, service, etc. If your organization is planning to write unit tests against your Angular code that's definitely another benefit that will help you catch errors early on in the development lifecycle.

## Summary

There are certainly many more benefits that could be discussed, but I wanted to focus on 5 that I think are important to consider. Are these the "correct" benefits to focus on? That's a very subjective question of course. For my company and many others that we work with, consistency, maintainability, productivity, modularity, and the ability to catch errors early are definitely at the top of the list.

It's important to note that many of these benefits can be achieved using other JavaScript libraries/frameworks as well (refer to my "one size does not fit all" discussion). The goal of this post is **NOT** to infer that Angular is the only client-side framework that offers these benefits. Instead, the goal is to help those considering Angular and TypeScript to better understand some of the key benefits they offer.
