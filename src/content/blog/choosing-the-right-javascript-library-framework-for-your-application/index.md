---
title: "Choosing the \"Right\" JavaScript Library/Framework for Your Application"
date: 2017-11-24
categories: 
  - "angular"
  - "angularjs"
  - "javascript"
  - "react"
  - "spa"
  - "typescript"
  - "vuejs"
coverImage: "RightTool.jpg"
---

[![](/images/blog/choosing-the-right-javascript-library-framework-for-your-application/RightTool.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/11/RightTool.jpg)"What's the 'right' JavaScript library/framework for us to use?". That's a question that comes up a lot nowadays given the multitude of choices available and one that doesn't have a "right" answer of course. I'm fond of saying, "Use the right tool for the right job" when I'm onsite at a company [teaching a training class](https://www.codewithdan.com/products/productType/training) or providing architecture/consulting services. While I certainly have my technology preferences, to force them on someone or on one of the companies I work with would quite honestly be naive and shortsighted. If there's one thing I've learned working in technology over 20 years now, it's that "one size fits all" is **never** a valid view in technology (or life in general). The world's way too diverse for "one size fits all". We all like to think that our way is the "right way" (I include myself in that statement), but that view is very subjective and limited to what we like and don't like, what we know and are comfortable using, our personal experiences, the types of applications we're building, as well as many other factors.

When it comes to JavaScript libraries/frameworks, it's no secret that I'm a [fan of Angular](https://blog.codewithdan.com/2017/08/26/5-key-benefits-of-angular-and-typescript/) and have been for many years going back to the AngularJS days. I've seen both versions used very successfully in small and large companies. Having said that this post won't focus on Angular at all. In fact, I like other options as well ([Vue.js](https://vuejs.org/) is one that I really like for example) and use them in my company's and our clients' applications as appropriate. I don't believe in "one size fits all" as mentioned earlier and instead always try to focus on the "right tool for the right job", or you might say "right tool for the right app".

For example, about a year ago we needed to build a small data-centric app that dynamically rendered controls based on hierarchical no-SQL data and sent the edited data back to the server for processing. We started out using a framework and soon realized it was overkill for the business problem we were trying to solve. We needed a JavaScript data binding library to get the job done - nothing more. While we could've gone with React, Angular, Vue.js or another similar option, we ended up going with [Knockout.js](http://knockoutjs.com/) (something we were very familiar with) because it provided the exact functionality we needed. That gets back to my "right tool for the right job" comment earlier. We're currently working with several companies that are building large-scale applications that have a lot of features. Something like Knockout.js probably _isn't_ the right tool for those types of applications because they need data binding plus several additional features that other libraries/frameworks can provide out-of-the-box.

Should you pick Angular, Vue.js, React or another library/framework? Many teams feel overwhelmed by the sheer number of choices out there and are afraid of making the "wrong choice". Here are my general thoughts on making a choice. I won't be recommending a specific library/framework but instead walking through some key questions I think you should ask during the selection process.

## Do Our Users Care?

[![](/images/blog/choosing-the-right-javascript-library-framework-for-your-application/man-on-mac.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/11/man-on-mac.jpg)When a debate comes up about a library/framework I always like to say, "My mom doesn't care what you use (and neither do your users)!". That could be said about the majority of clients using any application you or I have ever written. They want something that works, solves a business problem, and is quick and easy to use. Very few application users poke around and ask, "Hmmm...I wonder what library/framework they're using?". When making a decision about a library/framework remember that the application you're writing is supposed to be solving a business problem for customers - not for you (in most cases anyway). Eliminate personal biases about libraries/frameworks and you'll ultimately make a better decision in the long-run. We tend to gravitate to concepts we already know and feel comfortable using. It's important that we're willing to step outside of our "comfort bounds" though when making a decision. Every single library/framework I've worked with over the years has pros and cons. We tend to ignore the cons for libraries/frameworks we're comfortable using whether we acknowledge it or not.

As developers, we tend to get caught up in our own little world and get into time-wasting battles over "who is right?". We often forget that as long as the application does what it's supposed to do, our clients will likely be happy using it. If we boil our job down, isn't adding business value and keeping users happy what the job is all about? As long as a given library/framework can be used to build a successful application, then the library/framework you choose really doesn't matter assuming it meets your business, performance, and maintenance goals. It just doesn't matter - my mom and your clients don't care. Of course, there's more to the app development story aside from keeping users happy and adding business value.

## What Will Make You the Most Productive?

[![](/images/blog/choosing-the-right-javascript-library-framework-for-your-application/gears.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/11/gears.jpg)What language, library, and/or framework will make your team the most productive? That's the next question I like to address. If it's JavaScript (since that's the focus of this post), are your team members proficient in ES5, ES2015, TypeScript, CoffeeScript, Elm, or something else? Do they already work with frameworks or have more of a scripting background?

I'm not a fan of jumping into a "popular" library/framework without the pre-requisite skills to be productive using it. Doing that ultimately leads to more problems than solutions in my experience no matter how great a library/framework may be. I've seen it happen time after time where a manager thinks they can send a developer to a class and that they'll come back knowing everything they need to know.

Not knowing the key aspects of a library/framework can lead to applications being built that aren't based on best practices and riddled with maintenance issues as a result (more on that in a moment). While a team can certainly be trained on a new language or library/framework, it takes time for them to become efficient and productive using it. Pick a small prototype application to build if you want to prove out a library/framework. Once the prototype app is created have a team discussion about how productive everyone felt they were, pros and cons, and general opinions from team members. I don't care if it's Angular, Vue.js, React or something else, start with something small if you're in the process of choosing a library/framework. Take the time to do a proof of concept.

## What's the Maintenance Story?

[![](/images/blog/choosing-the-right-javascript-library-framework-for-your-application/maintenance.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/11/maintenance.jpg)I've done a lot of production support/maintenance on applications over my career and realized early on how important it is to build applications that are easy to maintain. Change is inevitable in the world of technology (yes - I'm stating the obvious here) so going with a library/framework that your team feels comfortable maintaining is important. This includes evaluating how easy it'll be to hire new people that can hit the ground running with the chosen library/framework, taking into account contractor work (if your company uses contractors) and more.

A few questions to ask related to maintenance:

1. Are the developers and/or production support teams used to working with a compiler or a scripted language? Often times it's not as simple as choosing a library/framework - you need to choose the language as well. That might seem obvious (JavaScript), but there are other options to consider. Being careful to choose the underlying language that will be used along with the library/framework is important. Developers used to a compiler may like something like TypeScript for example, whereas JavaScript developers with no experience using a compiler may feel more productive and comfortable using ES5 or ES2015.
2. Does your team write unit tests, end-to-end tests, etc.? Does the library/framework provide good support for that?
3. What is the deployment process like for the library/framework? Is it as simple as moving a few files or is there a build process involved?
4. Does the library/framework provide a way to organize code and features?
5. Does the library/framework provide a widely accepted style guide or list of best practices that developers on a team can follow to ease maintenance down the road?

The maintenance story is one of the most important factors to me personally when choosing a library/framework.

## What's the Longevity of the Library/Framework?

[![](/images/blog/choosing-the-right-javascript-library-framework-for-your-application/time.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/11/time.jpg)Before making a decision on any library/framework I recommend spending time looking at the source code repository. Here are a few questions to ask:

1. When was the last time the library/framework was updated? Is it stale or actively moving forward?
2. How does the library/framework team handle versioning and does it fit into how your team/company works?
3. How robust is the general open source community for the library/framework (this is a key question I always ask before jumping into a library/framework)?
4. How quickly are issues resolved? On a side note, don't judge a library/framework by the total number of unresolved issues. Some people tend to use the "Issues" area of a repository to post questions and make feature suggestions which aren't issues. I like to look at how often issues are being resolved to get a sense of the health of a given library/framework.
5. How many contributors does the library/framework have?
6. Is the library/framework supported by a full-time team or run by an open-source community. There are pros and cons to both of these.

I wish I had a dollar for every time I've been asked, "How long do you think library/framework X will be around?". It's a great question and something we all worry about. Some companies don't have the luxury of constantly updating their applications which is why teams are scared of picking a library/framework that may disappear one day. If only I had a crystal ball to help predict the future. :-)

JavaScript projects move fast and tend to have a lot of churn. I'd recommend picking a library/framework that has been stable for at least a year, has a robust community behind it, and that updates frequently.

## Choose a Library or a Framework?

Are you looking for specific library functionality (such as rendering the UI and/or data binding) or do you want a full-featured framework that has a lot of functionality included out-of-the-box? Libraries typically target a few very specific features whereas frameworks cover a brand range of features.

If your team is already using a framework (on the server-side for example), then moving to a JavaScript framework may make sense to keep things as consistent as possible between the client and server. On the other hand, if you prefer to put together different libraries (similar to choosing what you want to eat at a buffet) so that you have the flexibility to swap out different features as needed, then one or more libraries may be what you're after. As with everything, there are pros and cons to both approaches.[![](/images/blog/choosing-the-right-javascript-library-framework-for-your-application/blueprint.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/11/blueprint.jpg)

I was initially attracted to AngularJS (and now Angular) because of the framework functionality they provide. I have a Java and .NET background and have released many successful web apps over the years using frameworks. I like the consistency that frameworks typically bring to the table for developers on a team. Features such as UI rendering, data binding, routing, form validation, testing, and much more are available out-of-the-box in frameworks like Angular.

Libraries like React and others can provide a lot of functionality without the overhead of a "framework". They can make it quicker and easier to get started (a very subjective statement I realize) and are generally more lightweight depending on the functionality your application needs. So which is better - a library or a framework? Talk to 100 developers and you'll get 100 different answers. Here's my view of some of the popular libraries and frameworks out there. These certainly aren't the only options, but they're the big players as of today (in my opinion anyway). Here are 3 that I've personally looked into, worked with directly, or seen used successfully at companies I work with.

**Vue.js** - [Vue.js](https://vuejs.org/) is a "progressive JavaScript framework" (although I've always thought of it as a library). With additional scripts, you can build both large and small apps using Vue. In addition to being lightweight, it's also very fast and is really easy to get started using. If you're familiar with AngularJS (the 1.x version) you'll pick up on Vue very quickly. It's an open source project that is growing rapidly. It has a CLI to help get started with your first project: **npm install -g vue-cli**

**React** - [React](https://reactjs.org/) is a UI library that has many additional features (and 3rd party libraries) that can be added. It provides great performance, is easy to get started using, and is quite popular. A full-time team at Facebook as well as a robust open source community help run the project. A smaller variant of React called [Preact](https://preactjs.com/) is also available. It's used by Facebook which is a bonus when it comes to longevity. React provides a CLI to help get started: **npm install -g create-react-app**

**Angular** - If you prefer a framework then try out [Angular](https://angular.io/). It provides a robust set of features out of the box that are all integrated. It also provides Ahead-of-Time (AOT) compilation for production builds and has a robust CLI. It's run by a full-time team at Google and has a robust open source community as well. It's used by a lot of key apps inside of Google which is a bonus when it comes to longevity.  Note that if you're new to it, "AngularJS" refers to the 1.x version while "Angular" refers to the 2+ version. Get started using the CLI with the following command: **npm install -g @angular/cli**

There are certainly several more libraries/frameworks that could be listed and the list will definitely change over time. I made a decision to only list ones that I've had direct experience with either through development or working with a company.

## Are You Targeting Mobile?

If your apps will be run on mobile devices (web or "native"), how well does the library/framework you're looking at support mobile development? Do you have to build all of the mobile controls that are touch-optimized by hand? These and many additional questions can be asked as you're choosing a library/framework.

## What 3rd Party Options are Available?

[![](/images/blog/choosing-the-right-javascript-library-framework-for-your-application/light-bulb.jpg)](https://blog.codewithdan.com/wp-content/uploads/2017/11/light-bulb.jpg)Another factor to consider is the 3rd party options that are available for the library/framework you're considering. Do you really want to build that date picker or calendar from scratch (having done that (once), I'd argue "NO!"). Having a robust set of 3rd party functionality that you can include in a library/framework is important especially when it comes to productivity.

## Do You Really Need a Library/Framework?

Some people will argue that "vanilla" JavaScript is the way to go for JavaScript-centric applications so I wanted to mention that option. While I completely disagree with the "vanilla" JavaScript approach (especially for larger enterprise apps) for a variety of reasons, it's certainly a valid option to consider depending on the type of app you're building.

Why don't I like this approach? If the app being built is fairly small then the "vanilla" JavaScript approach may work fine. However, for more robust applications, everything has to be built from scratch which means reinventing the wheel for routing, data binding, form validation, history, and so on and so forth. It means knowing all of the browser quirks, security standards, new and upcoming technologies, and much more. Who has the time to consistently stay on top of all of that while also building business applications? What happens if the key person/people that built the "vanilla" JavaScript code base decide to leave for another job? Now you're not only worried about maintaining business applications, but also the custom JavaScript utilities or framework that someone built internally.

## Conclusion

Libraries/frameworks get very personal and it's important to take our personal biases out of the picture when making a library/framework decision. I've tried to steer clear of diving into pros and cons for specific libraries/frameworks (aside from mentioning a few above) since I feel strongly that each person/team needs to experiment on their own before making a decision. Talk to someone you trust who has used a library/framework you're considering to get their feedback. Build a simple prototype and see how you feel afterward. Find answers to some of the questions mentioned in this post.

There are many additional questions and guidelines that could be listed to help in choosing the "right" library/framework for your team. All libraries/frameworks have their own set of pros and cons and all of them can be used to build small, medium, and large applications. Is one better than the other or the "right" one to choose? There's no way to answer that since it's very subjective. [Here's a post](https://www.sitepen.com/blog/2017/11/10/web-frameworks-conclusions/) that mentions JavaScript library/framework strengths and weaknesses and while it's very opinionated, it provides a starting point. Many other posts comparing libraries/frameworks are out there as well, just keep in mind that each one is typically quite subjective.

I hope some of the guidelines and concepts listed here will help the decision process for you and your team.
