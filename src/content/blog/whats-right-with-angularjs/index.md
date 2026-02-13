---
title: "What’s “Right” with AngularJS?"
date: 2014-10-07
categories: 
  - "angularjs"
  - "javascript"
  - "spa"
---

There’s been a lot of discussion today on some email groups I’m involved with about a post titled [**What’s wrong with Angular.js**](https://medium.com/este-js-framework/whats-wrong-with-angular-js-97b0a787f903). I’d recommend reading through the post first before continuing but in a nutshell it makes it sound as if [AngularJS](https://angularjs.org/) isn’t a viable framework and should never be used. It also critiques two-way data binding which I found interesting (and misguided). It’s definitely a controversial post with some comments that made me laugh and others that I agreed with completely or in part.

I normally ignore these types of posts but in this case I wanted to address the points that were made since I suspect people new to AngularJS will wonder if they’re accurate or not.

## What’s “Right” with AngularJS?

I use AngularJS a lot now days and think that it has many superb features built-in out of the box. But, I’ll be the first to admit that it has some flaws as well.  The same can be said about any framework out there though. We normally gloss over flaws that we find in frameworks we like and point out flaws in frameworks we don’t like. Most of the flaws that I don’t like are being enhanced or added in [version 2](https://blog.angularjs.org/2014/03/angular-20.html?_escaped_fragment_=) which is great. It’s nice when a framework is open about its future and the AngularJS team has been very open even going to the effort of publishing weekly meeting notes. 

I wasn’t always a big fan of AngularJS but once I figured it out and learned about how it works I became a _huge_ fan. Having said that, I’m also very open to other options and don’t get all religious about languages, frameworks, etc. While I use AngularJS a lot today that may change down the road if I find something I think is better. Software is constantly evolving and keeping up is part of the fun.

Getting back to the _[What’s wrong with Angular.js](https://medium.com/este-js-framework/whats-wrong-with-angular-js-97b0a787f903)_ post, here are my thoughts on the main points that the author makes. All of the points highlighted below are directly from the post and provide some good talking points to cover what’s “right” with AngularJS.  
  

### 1\. “We are developers, we write and debug code. But Angular is HTML parser.”

AngularJS absolutely does a lot of HTML parsing. But, if you do any maintenance of apps or care much about productivity then the declarative approach AngularJS provides is refreshing. There’s no “one size fits all solution” out there of course but the declarative approach mixed with JavaScript code works out very well in many cases as several other frameworks have shown and proven out (Durandal, Ember, KnockoutJS library, desktop frameworks, etc.). Yes, directives are specific to Angular and make your views Angular-specific, but if you use [KnockoutJS](http://knockoutjs.com/) you use their _data-bind_ syntax (and would have to rip it out to change the data binding), if you use [Ember](http://emberjs.com/) you’re using [Handlebars](http://handlebarsjs.com/) (and would have to rip it out to change frameworks), and I can go on and on. There’s a reason Angular took the declarative approach and I applaud it.

Having said that, if you’re putting a lot of complex expressions into your AngularJS views, adding DOM code to controllers, not leveraging directives or filters where you should in views, etc. then the app can certainly get out of control, become hard to maintain, and feel “messy”. If you understand how AngularJS works though, know what to put into views and what to put into directives or filters, understand the boundaries, the role of controllers and factories/services, etc. then you can develop an extremely clean code base.

While on this topic, I saw a comment elsewhere about getting requests to rip out Angular from projects due to the directives and expressions in HTML and that it meant AngularJS was bad. We’re seeing the exact opposite actually with my company. We’re seeing a huge number of requests for new AngularJS project work and training (yes, that may bias me somewhat but I try to stay open minded to other solutions as well since we work with a variety of companies and not all of them do AngularJS). A company wanting to rip Angular out or wanting to start a new Angular project doesn’t imply Angular is good or bad since there are a variety of reasons people want to rip it out or add it in (developer skills, moving a different direction, just didn’t like it, love it, plus more). Every situation is unique and these “umbrella” statements that imply something is good or bad based on one scenario are just plain ignorant.  
  

### 2\. “Two way databinding is an anti-pattern.”

In some situations that may be true I suppose. But, for apps that collect and display a lot of data I’d have to disagree completely. I guess KnockoutJS, Ember, Durandal and even Desktop frameworks like WPF and all the other options out there for two-way data binding have it all wrong then right (even though they’re working fine and many developers would praise them)? Based on the “Binding from model to view is ok, but from view to model, it’s completely different story!” comment in the post I have to wonder what types of apps the author is building. We build a lot of Line of Business apps and Angular has been a pleasure to work with in that scenario. Is it appropriate for every type of app and does two-way data binding work well in all scenarios? Of course not – that goes without saying. If I was building an app that has to track a lot of  graphics on a page I’m going to pick a framework that is designed for that. If I’m doing an app that’s mainly read-only data then I’d have to consider if I need AngularJS or not.

There’s a comment next to that paragraph where the author also states, “While it certainly makes for a nifty demo, and works for the most basic CRUD, it doesn’t tend to be terribly useful in your real-world app.” This comment definitely gave me a good laugh having worked with two-way data binding for many years now (well before AngularJS came on to the scene). I guess those real-world apps many of us have built in AngularJS, KnockoutJS, WPF, and other declarative, two-way binding frameworks/libraries were all bogus and we were inventing reasons to use two-way data binding for nothing. Seriously though, two-way data binding absolutely has its place and I think he’s trying to apply a fairly narrow viewpoint to every situation which doesn’t work.

Bottom line - If Angular went away I’d still be a fan of two-way data binding. If someone wants to call it an “anti-pattern” that won’t change how I think of it because it’s proven itself out to me over the years. I’ve gone the other route where you manually handle getting the data back into the model layer from the UI and it’s not fun, very brittle, and much harder to maintain.

### 3\. “Dirty checking, accessors (Ember and Backbone), Object.observe and all that stuff. Wrong!”

This is related to the previous point actually since it’s tied to data binding in AngularJS. Dirty checking definitely isn’t the strongest feature of AngularJS so I think this is a somewhat valid point in specific scenarios with a ton of data binding going on. But, it gets the job done and does it well if you know about certain rabbit holes and how to avoid them. If you have too many bindings and a large amount of data you’ll know about it as the app becomes sluggish and be forced to optimize things more (which is a good thing). But, he even rags on Object.observe which has very limited support right now and is super early so I’m not sure what he’s basing his mobile battery “hungry dog” comment on. He might be right but there’s no way he can back up that statement at this stage.

How many data bindings/observables are you going to push down to a mobile device in reality anyway if you’re doing it right? Everything has trade-offs but I’m up for the productivity benefits dirty-checking and two-way data binding provides since I’m not seeing any performance problems right now in our apps.

### 4\. “Duplicated app structure with obsolete angular.module”.

Angular provides the ability to create modules that can be combined with other modules to promote re-use and simplified maintenance. That’s one of the big reasons I like it so this is another comment that made me laugh but also wonder exactly what the author meant. There are certainly improvements that can be made here (lazy-loading of modules, dynamic loading of specific scripts, etc.) but it works well and it’s going to get even better in version 2 as the entire framework becomes more modular - including things like dependency injection.  
  
I’m not sure where the author is going with this point given that Angular is very modular (not perfect…but more modular than many of the other options out there). You can definitely break an app up into little pieces for re-use or for team work items. If you design it properly you can completely switch out your client-side data layer (factories/services in Angular-speak) and never touch your views or controllers. You can completely switch out your backend and only have to update your factories/services (potentially – assuming the API changes). It all comes down to knowing how to put the different pieces together though.  
 

### 5\. “Angular is slow”

If I had a dollar for every time I’ve heard someone say that about a framework over the years I’d be retired! People love to make generalized statements like “Framework X is slow” if they don’t like it and want to turn others off to it. If you don’t know what you’re doing then Angular can absolutely get slow with large amounts data bindings. I can also make KnockoutJS slow, Ember slow, jQuery/DOM slow, and many other libraries as well by doing stupid things. That’s why they introduced directives like _ng-model-options_ so that you can have better control over binding and why they’re working with Object.observe for the future version.

The main point here is that any framework can be slow if you don’t know it well and understand how it works under the covers. Angular in particular isn’t slow but it can be made to be slow by developers. Is there room for improvement? Absolutely, but to call it “slow” is misleading at best and completely dependent on the type of app being built. Use the right tool for the right job!  
  
  

### 6\. “No server side rendering without obscure hacks”

Angular has absolutely ZERO server-side functionality since it’s a client-side framework. If switching your views’ _templateUrl_ to an MVC, Node.js/Express, Rails, etc. route to render a partial HTML fragment on the server-side that the SPA then consumes is a hack then I guess he’s right (if you haven’t done it, it’s very easy in my opinion).  I call them “Hybrid SPAs” and wrote a post about the [role of the server in SPAs](https://weblogs.asp.net/dwahlin/what-s-the-role-of-the-server-in-single-page-applications-spas) if you’re interested. However, I don’t think he’s talking about that here.

More than likely he’s referring to Search Engine Optimization (SEO) issues which is the Achilles’ heel of any client-side framework – which he conveniently fails to mention. If SEO is a key part of your app then SPAs may not be the best way to go in the first place. If you do want SEO then there are some “hacks” (see [this](http://www.yearofmoo.com/2012/11/angularjs-and-seo.html), [this](http://scotch.io/tutorials/javascript/angularjs-seo-with-prerender-io), and [this](http://www.ng-newsletter.com/posts/serious-angular-seo.html)) that can be used to render a static version of your site that can be crawled. These “hacks” are needed for the other client-side frameworks out there as well. [Google announced](https://developers.google.com/webmasters/ajax-crawling/) they’re starting to crawl JavaScript now so I suspect the story will get better with all JavaScript frameworks in the near future as other search engines follow.

### 7\. “Angular is hard to learn”

I’ll give him full points on this one - at least at first glance. I found it hard to learn at first – I admit it. Keep in mind that when I started there were very few docs though and next to no videos out there which made it much harder. The perceived barrier to entry is probably why my company is seeing a lot of AngularJS training requests now days.

But, it’s not nearly as hard as it may appear at first glance and once you know a few basic concepts (directives, scope, and controllers to get started) you can be up in running in no time at all. If you're brand new to it take 20 minutes and I'll show you how easy it is to get started [here](https://www.youtube.com/watch?v=tnXO-i7944M). Once you have that “light bulb” moment as I like to call it and understand how everything fits together it becomes much easier to work with.

Once you understand the available Lego blocks and how they fit together it’s not hard at all assuming you know HTML/CSS/JavaScript. You'll find that it's very empowering. Writing custom directives could certainly be made much easier since they can be a bit tricky (but not everyone needs to write custom directives), scope can get tricky in some scenarios, and there are a few other tricky things (when to use $apply, factory vs. service vs. provider, etc.). But I think you can find “hard” things in just about any framework out there. I’ve never seen Angular “promoted as easy framework for beginners” though as he states in the post although a beginner could get the feel of it quickly. Watch my [AngularJS in 60ish Minutes](https://www.youtube.com/watch?v=i9MHigUZKEM) video and by the end you’ll see that it’s not hard and actually very powerful once you understand all the pieces.  
  

### **8\. “Google does not use Angular in production for their flag apps like Gmail or Gplus.”**

Google is a big company with many technologies to choose from. Gmail was around WAY before Angular of course and given the extremely high usage of Gmail, AngularJS may not be the best solution there potentially. It’s hard to say. If Gmail or Google+ isn’t using the [Go language](http://golang.org/) does that make Go an irrelevant language?  
  

### 9\. “Vendor Lock”

Does anyone else get tired of hearing this? Get deep into any framework (OSS or from a company) and you’re “locked in”. There are over 800+ open source contributors last I heard to AngularJS so even if Google drops it at this point I’m confident it’ll take on a life of its own. Any framework that gets released by a corporation seems to have the “vendor lock” label associated with it now days. It’s the OSS purists’ response to anything tied to a corporation it seems. Now, keep in mind I’m a huge fan of OSS but have also been bitten by the “dead OSS project” challenge as well where I was “locked in” to a project that died on the vine as people got bored with it. It goes both ways (especially if you go with OSS projects that don’t have a lot of contributors or with an unproven company) but you should know that going into a project. Yes, AngularJS is driven by a team at Google right now but they’re also closely tied to a community of contributors. I personally like the stability that brings – best of both worlds.

What’s really funny about this is that I’ve seen a few of the anti-AngularJS crowd promoting [Facebook’s React](http://facebook.github.io/react/) library lately. Nothing wrong with that at all (I’ve only played with React briefly at this point so I can’t comment on the good or bad) but isn’t that the same type of “vendor lock-in”? There’s a lot of hypocrisy there.

### 10\. “Will be rewritten entirely soon, which is a good thing for framework, but pain for you.”

Yes, version 2.0 will change things but how do you know it’ll be a pain when it’s not even out yet? Even if it’s a big migration (and I don’t know that – pretending for the sake of argument), it’s not a pain for “you” since “you” would have to choose to move to V2 right away or keep going with the 1.3x branch. It’s not like when V2 is released that all of the other stuff instantly stops working and that the older version is irrelevant. At the pace of technology now days it’s not feasible for most enterprises (and even smaller companies) to constantly be moving to the latest and greatest version.

In AngularJS [version 2](https://blog.angularjs.org/2014/03/angular-20.html?_escaped_fragment_=) they’re taking the modern (ES6 with backward porting capability to ES5) and modular approach. I like what they’re doing and think it makes sense.

## Wrap Up

There’s not one framework, library or component that fits all scenarios perfectly. People always try to find that “one” solution but if you’ve been building software long enough then you know it doesn’t exist and probably never will. Some people prefer the minimal framework with more custom code. I say, “More power to them” if that’s appropriate for their target scenario. I like to build on top of frameworks that give me a lot of power at my fingertips whenever possible. Could the framework change? Could something better come out in the near future? I can reply with a confident “yes” to those types of questions. If you’re in the software business then you just accept that those things will happen and try to make the best decision based on the current app requirements, current environment, team skills, time-frame, and where you think things are heading in the future.

AngularJS is absolutely valuable when used properly in my experience so don’t read a post like that and take it as the “truth”. Yes –AngularJS has a few flaws that I don’t like (dirty checking could be better – and will be with Object.observe, routing needs a lot of work – and they’re doing that now, debugging certain issues like {{ }} on a blank screen, plus more) but I love the vast majority of what it offers and feel it gives a big boost to my productivity and the productivity of our clients. I like the existing dependency injection (the future DI is going to get even better), the modularity, core framework functionality, two-way data binding, and the simplified maintenance. Overall – I’m a big fan. Tomorrow that may change, but welcome to the world of software where planning for change comes as part of the job. Change is what has kept software exciting for me over the years.

At the risk of sounding “preachy” – make your own decisions. Don’t trust me, don’t trust the author of the post, or anyone else for that matter. The Web is crawling with supposed “experts” but every app is unique so build a prototype and prove out your framework/library of choice whether it’s AngularJS or any other framework.

To wrap this up, what do I think is “right” with AngularJS? A lot of things. Support for building SPAs, MV\* approach, two-way data binding, testability, modularity, separation of concerns, routing (native or 3rd party), animations, mobile-capable, good maintenance story, supported by a core team as well as tons of OSS contributors, and I could go on and on. But, if AngularJS goes away at some point and I have to pick up the “next best thing” I’m OK with that.

My friend John Papa also [put together a post](http://www.johnpapa.net/why-does-there-have-to-be-something-wrong-with-angularjs/) about the points here if you'd like another perspective.
