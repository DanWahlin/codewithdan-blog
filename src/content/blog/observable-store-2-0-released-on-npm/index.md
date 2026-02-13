---
title: "Observable Store 2.0 Released on npm!"
date: 2019-10-14
categories: 
  - "javascript"
  - "typescript"
tags: 
  - "observable-store"
  - "rxjs"
  - "state-management"
coverImage: "ObservableStore.png"
---

![](/images/blog/observable-store-2-0-released-on-npm/ObservableStore-1024x499.png)

I'm excited to announce the release of [Observable Store 2.0 on npm](https://www.npmjs.com/package/@codewithdan/observable-store)! You can get started using it with the standard **npm install** command:

```bash
npm install @codewithdan/observable-store
```

The [Github repository](https://github.com/danwahlin/observable-store) provides information about the specific steps to get started and how Observable Store can be used with various front-end projects.

## Why Observable Store?

Before jumping in to what's new in 2.0, let me give a quick overview of the [Observable Store](https://github.com/danwahlin/observable-store) project in case you're new to it. Several years ago I was working with a few large companies here in the United States who were building Angular and React apps. One in particular was hiring a lot of front-end developers and struggling with getting them up-to-speed with the library/framework being used. Adding in the complexity of some of the available state management options at the time (redux, etc.) really made it challenging for the new hires since it tended to add a lot of complexity and code. The existing state management solutions also locked you into a specific framework/library which wasn't desirable for some of the teams.

As I talked with various teams and worked on a large project within [my own company](https://codewithdan.com) as well, I wondered if there might be a more simple way to achieve the same overall goals that more complex state management solutions have. I came up with the following set of goals that I wanted Observable Store to satisfy. If you're familiar with other front-end state management options you'll probably recognize many of these.

- Keep it simple!
- Single source of truth for state
- Store state is immutable
- Provide state change notifications to any subscriber
- Track state change history
- Easy to understand with a minimal amount of code required to get started
- Works with any front-end project built with JavaScript or TypeScript (Angular, React, Vue, or anything else)

At the time I had been working a lot with [RxJS](https://rxjs.dev) and knew that it could help a lot with providing [state change notifications](https://blog.codewithdan.com/ng-conf-talk-mastering-the-subject-communication-options-in-rxjs/) (something that's key with state management) so I decided to make an initial attempt at creating a simple state store that other objects within an application could extend to instantly get state management functionality.

That project eventually grew into [Observable Store](https://github.com/danwahlin/observable-store) and my team ended up using it in a project we're working on that has a lot of complex state management needs. I've already discussed Observable Store in a previous post so if you'd like to learn more read [Simplifying Front-End State Management with Observable Store](https://blog.codewithdan.com/simplifying-front-end-state-management-with-observable-store/) or check out the project's [Github repository](https://github.com/danwahlin/observable-store).

## Observable Store 2.0 Features and Changes

The overall goal of Observable Store is to keep things simple and with the 2.0 release that still holds true. Here's a quick rundown on what's new.

#### Global Store Settings

The underlying API has stayed the same (no breaking API changes), but the way settings can be passed to the store is now more flexible. Observable Store 2.0 has a **globalSettings** option that allows settings to be defined once for the entire application. Previously settings were passed through a [service that extended Observable Store](https://github.com/danwahlin/observable-store#steps-to-use-observable-store). While this approach worked fine, if you had 10 services that extended Observable Store and wanted a particular settings to always be "on" (such as **trackStateHistory**) for all services, then you had to pass the setting 10 times. Now that setting can be set as the application initializes using the **globalSettings** property:

```typescript
ObservableStore.globalSettings = { ...settings go here };
```

Any global settings can be overridden by a service that extends **ObservableStore** as well giving you complete control over when a setting may need to be changed. For a complete list of settings visit the Github repository:

- [General Store Settings](https://github.com/danwahlin/observable-store#settings)
- [Global Store Settings](https://github.com/danwahlin/observable-store#global-store-settings)

#### Enhanced Type Support

Behind the scenes Observable Store also adds additional type support using TypeScript generics. Previously, the **stateChanged** observable was typed as **Observable<any>** since a slice of state could be returned as opposed to the entire state of the store. With Observable Store 2.0 (based on user feedback) I've decided to change **stateChanged** to **Observable<T>** where **T** is an interface or class describing the store state. By using **Observable<T>** users get better intellisense/code help when subscribing to **stateChange**. If they do return a slice of the state they can define a different type in the subscription parameter signature to handle the casting. Thanks to [GustavoCostaW](https://github.com/DanWahlin/Observable-Store/issues/39) for the suggestion.

#### RxJS as a Peer Dependency

In Observable Store 1.x RxJS was a required dependency causing the RxJS module to be installed under **@codewithdan/observable-store** in **node\_modules**. This worked fine until RxJS was installed somewhere else in **node\_modules** (see my post on solving the issue of having [multiple RxJS installations in node\_modules here](https://blog.codewithdan.com/rxjs-error-types-of-property-source-are-incompatible/)). With Observable Store 2.0 RxJS is now a peer dependency which means users will have to install it themselves. The docs have been updated to mention this change.

#### Cloning State

Observable Store 2.0 clones state to ensure immutability within the store and that state change detection works correctly across different front-end libraries. While this works great and serves its purpose, it's actually only needed during development. Once code is working properly and an application is built for production, some of the cloning can be disabled to enhance performance which is especially important with applications that store a large amount of data in the store.

The new **globalSettings** property now provides an **[isProduction](https://github.com/danwahlin/observable-store#the-isproduction-property)** setting. When **isProduction** is false (such as during development) then state cloning will be used as state enters and leaves the store. When **isProduction** is true, state cloning will be minimized to enhance performance. Thanks to [Mike Ryan](https://github.com/MikeRyanDev) from the [NgRx team](https://github.com/ngrx) for sharing this tip with me.

#### Compiling with CommonJS

Observable Store 1.0 used ES2015 modules for the TypeScript compilation. This worked great as long as application supported ES2015 module syntax but didn't work so great if a project or package didn't support that. An issue was reported by [roger-gl](https://github.com/DanWahlin/Observable-Store/issues/38) about Observable Store not working with Jest out of the box. After some digging into the issue I found that this was something that could be configured to work in Jest, but it was just as easy for me to make this work automatically by switching the Observable Store TypeScript compilation to use CommonJS. That is now enabled in 2.0 to make it work out of the box in scenarios that don't necessarily support ES2015 module syntax natively.

#### General Refactoring and Additional Unit Tests

The final major change is completely behind the scenes. All of the base store functionality, global settings, etc. have been moved into an **[ObservableStoreBase](https://github.com/DanWahlin/Observable-Store/blob/master/src/observable-store-base.ts)** class which acts as a singleton to store state. This is a minor change but provides an easier way to see what's created per service in an application versus created only once for an application.

Finally, additional [unit tests](http://tore/blob/master/src/observable-store.spec.ts) have been added to cover more scenarios. The number of tests will continue to grow over time.

#### Redux DevTools Support

Observable Store state can now be viewed using the Redux DevTools! If you've used these tools with Redux, NgRx, or another option, you can now access the same functionality. Check-out [this blog post on the topic](/observable-store-now-with-support-for-the-redux-devtools/).

![](/images/blog/observable-store-2-0-released-on-npm/reduxDevTools-1024x624.png)

## Summary

That's a wrap on the new features in Observable Store 2.0. There's nothing "earth shattering" included and I'm actually very happy about that since the overall goal of the project is to keep things simple and the project small. If you haven't tried it out, check out the [documentation](https://github.com/DanWahlin/Observable-Store) and [sample projects](https://github.com/DanWahlin/Observable-Store/tree/master/samples) in the repository and you'll see how easy it is to add state management into your application without adding a lot of code and complexity.

Thanks to everyone who has contributed code, documentation, and provided details about issues that have come up! I really appreciate it!

- ElAndyG - [elAndyG](https://github.com/elAndyG)
- Mickey Puri - [mickypuri](https://github.com/mickeypuri)
- Bob - [crowcoder](https://github.com/crowcoder)
- Adam L Barrett - [BigAB](https://github.com/BigAB)
- Gustavo Costa - [GustavoCostaW](https://github.com/GustavoCostaW)
- Brandon Roberts - [brandonroberts](https://github.com/brandonroberts)
