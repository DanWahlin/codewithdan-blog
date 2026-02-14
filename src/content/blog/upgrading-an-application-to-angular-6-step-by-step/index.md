---
title: "Upgrading an Application to Angular 6: Step By Step"
date: 2018-05-03
categories: 
  - "angular"
  - "rxjs"
  - "typescript"
---

[![](/images/blog/upgrading-an-application-to-angular-6-step-by-step/angular-e1459634290861.webp)](https://blog.codewithdan.com/wp-content/uploads/2016/03/angular-e1459634290861.png)Angular 6 is out and it offers some great [new functionality in the CLI and overall framework](https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4). One of the biggest new features (IMO anyway) is the CLIs support for schematics and the `ng new library` command to create and publish libraries (a big pain point that is now simplified). But, I digress....this post is about upgrading an application. [Click here](https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4) if you want a quick look at all of the great new features.

I have a large project I'm working on that's still in development so I decided to take the plunge and try out some of the new features to upgrade from Angular 5 to Angular 6. Here are the specific steps I went though along with some commentary along the way. Additional upgrade documentation can be [found here](https://update.angular.io/).

## Upgrade Steps

 

**1.** The first step was to update to the latest version of the Angular CLI:

`npm install -g @angular/cli`

 

**2.** From there I went into my project's root folder (where **package.json** lives) and ran the following command.

`ng update`

 

This command updates your **package.json** file to the latest Angular-related package versions. I was happy to see that it left all of my other dependencies alone. One of the unsung heroes of the CLI is the ability to do dry runs using the `--dry-run` or `-d` switches. You can use that here to see an overview of what will happen without actually affecting anything in your project. I use `-d` all the time when generating new files with the CLI to see what impact a given command will have.

Note that there are some other options you can pass to `ng update` which I'll mention below.

 

**3.** From there I ran `ng build` just to see where things stood code-wise. Everything built perfectly....no....no it didn't build perfectly. False alarm. OK - I have some work to do but fortunately it all seems related to some RxJS 6 changes. More on that in a moment.

 

**4.** I wanted to see any big differences in files like **angular-cli.json** between my project and projects created with the new version of the CLI so I ran `ng new my-project --routing` to create a new project. I noticed that **angular-cli.json** was renamed to **angular.json**. The JSON data is quite different between the two versions so I kept my older **angular-cli.json** file around temporarily and copied the new **angular.json** file into my project. I noted differences between the two, made the appropriate changes (such as the project name), and then deleted **angular-cli.json**. After doing a build I received the following error. It can't be all roses I guess. :-)

`Could not find module "@angular-devkit/build-angular"`

Note that you don't have to update your **angular-cli.json** file. Things will still build and work as expected without doing that. I did it manually as mentioned just to explore things more, but you can also run this command to update **package.json** versions AND change **angular-cli.json** to the newer **angular.json** format:

`ng update @angular/cli`

 

**5.** I figured that a package must be missing so I looked at the new project I generated earlier and noticed it had the following dev dependency in the **package.json** file:

`"@angular-devkit/build-angular": "~0.6.0"`

 

**6.** I added this new dependency into my project's **package.json** file and after running `npm i` tried out `ng build` again. While the previous error was gone, I hit a ton of RxJS errors (which was expected since I saw them earlier). RxJS has been changed in v6 to support better tree shaking and to simplify some of the import statements and some of these changes were causing the build errors as a result. You can find the [RxJS upgrade guide here](https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md). The errors mention not being able to find an **rxjs-compat** package. You can use that package if you want to leave your existing RxJS code "as is" and not take the time to move it completely to v6+. I had thought that the `ng update` command would automatically add the **rxjs-compat** package but it was nowhere to be found in my updated **package.json** file. While I could easily add it, I decided I was going all the way - out with the old and in with the new! Keep in mind that if you're using 3rd party libraries that rely on RxJS you'll need to add **rxjs-compat** into your **package.json** for now until the library is updated to use RxJS 6+.

 

**7.** The errors that were now showing (and there were a bunch of them) were due to changes in how RxJS symbols are imported with RxJS 6+. I had already moved to using piped operators (an optional change in RxJS v5.5) so I didn't have to change how I was using operators such as **map**, **catchError**, **filter**, **concatMap**, etc. You'll want to move to [piped operators](https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md#pipe-syntax) if you're still using the older chained operators.

I did have to make the following changes to all of my RxJS imports though throughout the project ([RxJS import changes can be found here](https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md#import-paths)). You'll notice that the changes are simple (and quite predictable). See the note below for an automated way of doing this update.

 

**import { Subscription } from 'rxjs/Subscription'** was changed to **import { Subscription } from 'rxjs'**

 

**import { Subject } from 'rxjs/Subject'** was changed to **import { Subject } from 'rxjs'**

 

**import { BehaviorSubject } from 'rxjs/BehaviorSubject'** was changed to **import { BehaviorSubject } from 'rxjs'**

 

**import { Observable } from 'rxjs/Observable'** was changed to **import { Observable } from 'rxjs'**

 

**import { of } from 'rxjs/observable/of'** was changed to **import { of } from 'rxjs'**

 

Note: [Igor Minar](https://twitter.com/igorminar) (Angular team core member) let me know about a package called [rxjs-tslint](https://www.npmjs.com/package/rxjs-tslint) that can help automate the process of moving from RxJS 5 to RxJS 6. You can get more details about it [here](https://www.npmjs.com/package/rxjs-tslint). After installing it you can run an **rxjs-5-to-6-migrate** command or update your **tslint.json** file to run it as part of your linting process.

 

**8.** POW! Everything compiled at that point which was good to see especially since I hadn't spent a ton of time on the migration. But, compiling is one thing. Running in the browser without any new errors is quite another thing. So did it work???

 

**9.** YEEEESSSS! The app loaded and worked as expected - no errors in the dev console. I ran my [Cypress.io](https://www.cypress.io/) end-to-end tests and everything checked out.

**10.** Although the project worked at this point, there was still one additional change I could (optionally) make related to services. v6 offers a new option that saves you having to manually define a service's provider in a module (or using the CLI with `--module` as you generate services). This new feature also adds better tree shaking support as well to the build process. I decided to remove my existing core module providers and go with the new `providedIn` property available in the Injectable decorator. This is how services look now when using `ng g service <myServiceName>`:

 

```

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
}
```

That changed my core module providers from:

```

providers: [
               CoursesDataService, EditService, DisplayModeService,
               UtilitiesService, FilterService, SorterService, Cloner,
               RouteParamsService, UsersDataService, UserProgressService,
               EventBusService, TemplateService,
               {
                  provide: HTTP_INTERCEPTORS,
                  useClass: AuthInterceptor,
                  multi: true,
                }
            ]
```

**TO:**

```

providers: [
               {
                  provide: HTTP_INTERCEPTORS,
                  useClass: AuthInterceptor,
                  multi: true,
                }
            ]
```

 

While that's a very minor change, the big benefit is in some of the enhanced tree shaking that the build process can do now.

 

## Summary

 

While each project always has its own unique challenges, I found the migration to Angular 6 nice and smooth overall. Some of the RxJS changes were a bit painful, but I like the changes due to better tree shaking and fewer import statements moving forward. I also could've chosen to use the **rxjs-compat** library to keep the existing RxJS code working "as is". I didn't do that, but it's a nice option to have if you want to move forward to v6 but not worry about changing imports and chained operators (if you aren't using piped operators yet).

Updating to the new **angular.json** file format also adds benefits that I can leverage down the road such as [CLI workspaces](https://blog.angular.io/version-6-of-angular-now-available-cc56b0efa7a4), `ng generate library` support, and more. This project didn't have many external dependencies on 3rd party libraries and I suspect some of those may cause migration challenges for other projects. That's a key scenario where you'll likely need to use **rxjs-compat** if the target library is using RxJS. But, in the end I spent less than 2 hours doing the upgrade plus writing this post while doing it....not bad at all!
