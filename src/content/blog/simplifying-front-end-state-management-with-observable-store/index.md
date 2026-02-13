---
title: "Simplifying Front-End State Management with Observable Store"
date: 2019-03-16
categories: 
  - "javascript"
  - "typescript"
tags: 
  - "immutable"
  - "notifications"
  - "observable"
  - "rxjs"
  - "simplicity"
  - "state-management"
  - "store"
  - "subscribe"
coverImage: "stones-270x250.png"
---

![](/images/blog/simplifying-front-end-state-management-with-observable-store/stones-1280-1024x576.jpg)

I admit it - I think the use of some front-end JavaScript state management patterns has gotten out of control. When you're spending a significant amount of time writing code (and often a lot of it) to handle application state or relying on a scaffolding tool that generates 100s or even 1000s of lines of code then it's time to take a step back and ask, "Do I really need all of this?". While you're at it you might also ask, "What can I do to simplify my code and bring some sanity back to it?".

Rather than ranting about my views on keeping software simple, choosing the right tool for the right job, the importance of considering maintenance costs, challenges that more complex patterns present when contractors or new hires are involved, and more, let me get right to the point:

> **I think front-end state management needs a big dose of simplicity!**

After hearing from many people and working on projects myself, I was frustrated with some of the state management options out there and decided to experiment with a simple solution that eventually became a project I call **Observable Store**. It turns out several people had a similar idea which was refreshing to see (there are a few similarly named projects on Github and npm).

**Note:** If you want my more opinionated view on state management complexity you can jump down to **[My Two Cents on State Management Complexity](#myTwoCents)** in this post.

## The Birth of Observable Store

One of the perks of my job is that I get to work with a lot of developers at companies around the world. This comes in the form of [architecture work, training, mentoring](https://codewithdan.com/products/productType/training), talking with people at conferences, meetups, [webinars](https://www.apexsystems.com/Events/Pages/CompletedEvents.aspx?filter=wahlin), and more. I've had many conversations about various state management options and listened to stories about what has worked and what hasn't. One common comment I've continually heard is, "I wish there was a more simple way to handle state management in my front-end apps".

As I've talked one on one with other architects and developers, helped people with their projects, and worked on my own, I've often asked, "What is it that you really want in a state management solution?". Here are main goals that came out of asking that question:

1. Single source of truth
2. State is read-only/immutable
3. Provide state change notifications to any subscriber
4. Track state change history
5. Minimal amount of code required
6. Works with any front-end library/framework (Angular, React, Vue.js, or anything else that supports JavaScript)

I started playing around with adding these general goals/concepts into a simple library about 1 1/2 years ago and ultimately developed something I now call [Observable Store](https://www.npmjs.com/package/@codewithdan/observable-store). I use it for any front-end projects I work on (React, Vue.js, Angular or others) that need a state management solution. Observable Store satisfies the goals mentioned above but does so in an extremely simple way. The code for the library is only around 220 lines total since the "power" it provides comes from using [RxJS Subjects and Observables](https://rxjs.dev/). In fact, Observable Store only has 1 dependency - RxJS.

So why consider Observable Store? If you're interested in achieving any of the goals shown earlier then Observable Store provides an extremely simple way to achieve those goals. You instantly get a single store that can be referenced throughout your app, state that is immutable (good for change detection in libraries/frameworks), state history tracking, and a way to subscribe to store changes. Plus, Observable Store can be used with any JavaScript library or framework. You're not locked into anything - except using JavaScript.

So how do you get started with Observable Store? Here's a quick overview.

## Getting Started with Observable Store

To get started with observable store you simply **npm install** it in your project (Angular, React, Vue.js, or any JavaScript project):

```bash
npm install @codewithdan/observable-store
```

From there you create a service class that extends **ObservableStore**. If you're working with TypeScript you can use a generic to pass the shape of the data that gets stored in the store (pass a class or interface). TypeScript isn't required though and it [works fine with ES2015](https://github.com/DanWahlin/Observable-Store#using-observable-store-with-react) (or even ES5) as well.

```typescript
// Optionally define what gets stored in the observable store
export interface StoreState {
    customers: Customer[];
    selectedCustomer: Customer;
    orders: Order[];
    selectedOrder: Order;
}

// Extend ObservableStore and optionally pass the store state
// using TypeScript generics (TypeScript isn't required though)
export class CustomersService extends ObservableStore<StoreState> {
  constructor() {
    // Pass initial store state (if desired). Want to track all
    // changes to the store? Set trackStateHistory to true.
    super(initialStoreState, { trackStateHistory: true });
  }
}
```

Now add any functions to your class to retrieve data from a data store and work with the data. Call **setState()** to set the state in the store or **getState()** to retrieve state from the store. When setting the state you can pass an action name which is useful when tracking [state changes and state history](https://github.com/DanWahlin/Observable-Store#using-observable-store-with-react).

```typescript
import { Observable, of } from 'rxjs';
import { ObservableStore } from '@codewithdan/observable-store';

export class CustomersService extends ObservableStore<StoreState> {
    constructor() { 
        const initialState = {
            customers: [],
            selectedCustomer: null,
            orders: Order[],
            selectedOrder: null
        }
        super(initialState, { trackStateHistory: true });
    }
 
    get() {
        // Get state from store
        const customers = this.getState().customers;
        if (customers) {
            // Return RxJS Observable
            return of(customers);
        }
        else {
            // call server and get data
            // assume async call here that returns Observable
            return asyncData;
        }
    }
 
    add(customer: Customer) {
        // Get state from store
        let state = this.getState();
        state.customers.push(customer);
        // Set state in store
        this.setState({ customers: state.customers }, 
                      'add_customer');
    }
 
    remove() {
        // Get state from store
        let state = this.getState();
        state.customers.splice(state.customers.length - 1, 1);
        // Set state in store
        this.setState({ customers: state.customers } 
                      'remove_customer');
    }
 
}
```

As the store state changes, any part of the application can be notified by subscribing to the store's **stateChanged** event. In this example changes made to the store by CustomersService will be received which provides a nice way to listen to a "slice" of the overall store quite easily.

```typescript
// Subscribe to the changes made to the store by 
// CustomersService. Note that you'll want to unsubscribe
// when done.
this.customersService.stateChanged.subscribe(state => {
  this.customers = state.customers;
});
```

Note that because the store state is immutable, a **stateChanged** subscriber will always get a "fresh" object back which works well with detecting state/data changes across libraries/frameworks. Because RxJS observables are used behind the scenes you can use all of the great operators that RxJS provides as well.

If you need to listen to all changes made to the store you can use the **[globalStateChanged](https://github.com/DanWahlin/Observable-Store#store-api)** event (thanks to [Mickey Puri](https://github.com/mickeypuri) for this contribution):

```typescript
// Subscribe to all store changes, not just the ones triggered
// by CustomersService
this.customersService.globalStateChanged.subscribe(state => {
  // access anything currently in the store here
});
```

You can even listen to a specific slice of the store (customers and orders for example) by supplying a **[stateSliceSelector](https://github.com/mickeypuri)** function.

To handle orders, you can create another class that extends **ObservableStore** and add the order related functionality in it. By breaking the functionality out into separate classes you can achieve single responsibility (the "S" in SOLID) while still having only one store backing the entire application.

```typescript
// Extend ObservableStore
export class OrdersService extends ObservableStore<StoreState> {
  constructor() {
    // Define that we want to track changes that this object
    // makes to the store
    super({ trackStateHistory: true });
  }
}
```

Both **CustomersService** and **OrdersService** share the same store (as do all classes that extend ObservableStore in your application).

The Observable Store [API](https://github.com/DanWahlin/Observable-Store#store-api) and [settings](https://github.com/DanWahlin/Observable-Store#store-api) are simple to learn and you can get it up and running in no time at all. You can find examples of using it with Angular and React apps (I'm hoping to add a Vue.js example in the near future) in the [Github repo](https://github.com/DanWahlin/Observable-Store).

Is Observable Store the answer to keeping state management simple in front-end applications? It's one potential solution that has worked well for my company and several other companies/developers who are using it. I've been using it privately for over a year now and really enjoy the simplicity it brings to the table. If you try it out or have questions about it feel free to leave a comment below or in the [Github repo](https://github.com/DanWahlin/Observable-Store/issues).

## My Two Cents on State Management Complexity

I mentioned toward the beginning of this post that I didn't want to get into "my" opinion on state management since I prefer to focus on potential solutions rather than focusing on problems. I'm just one guy after all that has an opinion that some may agree with and some definitely will disagree with. Having said that, many people ask my opinion about this particular subject so here's a quick summary of where I stand.

I think we often get caught up in the "group think" mode of developing software (something that I'm guilty of as well on occasion) and that results in great things and a lot of not so great things spreading like fire across the developer community. Because a concept or pattern is "popular" or "everyone is using it" we gravitate to it without digging in and considering if it's the best way to go for our specific application scenario, if it's actually necessary, and the pros/cons it brings to the team or project. It feels like a "sheep off the cliff" mentality in some cases. I recently [came across a post](https://medium.com/@amcdnl/the-future-of-javascript-state-management-is-less-state-management-ba1d97b99308) that echos a lot of my thoughts on the "state" of front-end state management complexity.

As I've worked with various companies around the world over the years, talked with developers at conferences, and interacted with people online, one of the main "gripes" I keep hearing can be summed up as, "Front-end state management complexity is killing us!". I also hear, "I can't believe how much code is added to our application to follow pattern X", or "We're using technology X and Y at work across teams and can't share our state management code between them!".

In all fairness, some of the patterns that are available like Redux provide a lot of value. For example, consistency for a team, insight into the flow of data, better debugging in some cases, and more. **I don't think there's any dispute there so I want to make that clear**. Many people are using some of the different font-end state management patterns very successfully especially with larger teams and a lot of moving parts. So what's the problem?

For starters, if everyone on a team doesn't understand a given pattern well, then they're copying and pasting code or using some type of scaffolding tool without really understanding what's going on and why they're doing it. As the application's complexity grows they feel more and more lost. This often applies to projects that bring in contractors, new hires, or developers that may not work solely in the front-end world. But, it applies to pure front-end developers too I've found.

An argument can be made that anyone using a pattern without really understanding it needs to take time to learn the pattern better, and I think that's a valid point. But, when someone didn't choose the pattern used in a project and deadlines are looming, they don't have much of a choice but to push through it even if they don't fully understand what's going on. Plus, I think there's also an argument to be made that if a pattern requires that much time and code to learn then maybe it's worth considering if it's the best way to go in the first place? Keep in mind I'm only talking about state management here. We still have the rest of the application to worry about as well.

In addition to understanding a pattern well, can you use the same code between different front-end JavaScript technologies and does the code look the same? For example, React has Redux, Angular has NgRx (Redux + RxJS), Vue.js has Vuex, and so on. That may not be an issue for you, but it is for several companies I work with because they don't want to maintain different implementations of the same overall pattern.

For the question, "Can you use the same code between different front-end JavaScript technologies?", I'm going to say the answer to that is a definite "No!" - sharing state management code often isn't an option in the majority of scenarios I've seen. The pattern used may be similar in some cases, but the implementations are radically different between libraries/frameworks. If your company isn't using just one main library/framework for front-end projects that can present a challenge when you're trying to make projects as consistent as possible (while also letting developers use the technology they prefer).

There are certainly additional challenges that I can point out with more complex state management options (maintenance challenges, the sheer amount of code added, bundle sizes, team knowledge, etc.) but that'll do for now. I think it really boils down to using the right tool for the right job and realizing that not everything is a nail that requires a complex hammer.

Isn't it worth considering if the state management pattern itself (whatever it is) may actually be overly complex for a given scenario and that viable alternatives may exist? One size NEVER fits all and there are many applications out there using a complex state management pattern that simply don't need it at all. I've seen it myself many times at companies. For example, an application may perform standard CRUD (Create, Read, Update, Delete) operations directly to a back-end service. Once an operation is complete it's done. Aside from showing a message to the user there's nothing else to do from a state perspective. In this simple scenario and many others there's often no need for a complex state management solution - it would only add unnecessary complexity. Which brings me to 3 of my favorite words: "keep it simple".

I truly admire architects and developers that have the wisdom, knowledge, expertise, and ability to keep their application code as simple as possible while still meeting the needs of users. Building good software is hard, and the ability to keep code simple is arguably just as hard. It's an art and skill that has to be developed over time and in some cases I feel like that skill has been lost. Keeping things as simple as possible yields many positive results in the end - especially when it comes to long-term maintenance.

This is definitely one of those highly subjective topics I realize, but let me know your \*constructive\* thoughts on it in the comments. Every situation is different so I'm always interested in hearing different opinions. You can reach out to me on [Twitter](https://twitter.com/danwahlin) as well.

Cross posted to [dev.to](https://dev.to/danwahlin/simplifying-front-end-state-management-with-observable-store-1jjp).

[Discuss on Twitter](https://twitter.com/search?q=https%3A%2F%2Fblog.codewithdan.com%2Fsimplifying-front-end-state-management-with-observable-store%2F&src=typd)
