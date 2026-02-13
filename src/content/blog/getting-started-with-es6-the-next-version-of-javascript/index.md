---
title: "Getting Started with ES6 – The Next Version of JavaScript"
date: 2014-12-06
categories: 
  - "ecmascript6"
  - "es6"
  - "javascript"
---

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/57c59b2be72b_127DE/image_8.png)

JavaScript has come a long ways in its 20 years of existence. It’s grown from a language used to define a few variables and functions to one that can be used to build robust applications on the client-side and server-side. Although it’s popularity continues to grow in large part due to its dynamic nature and ability to run anywhere, JavaScript as a language is still missing many key features that could help increase developer productivity and provide a more maintainable code base. Fortunately, [ECMAScript 6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) (ES6) adds many new features that will take the language to the next level.

This is the first post in a series I’ll be writing that will walk through key features in ES6 and explain how they can be used. I’ll also introduce tools and other languages along the way that can be used to work with ES6 in different browsers as well as on the server-side with frameworks like [Node.js](http://nodejs.org/). The goal of this first post is to discuss the viability of using ES6 today and point out resources that can help you get started using it. Let’s kick things off by talking about a few of the key features in ES6.

## Key Features in ES6

So what are some of the key features in ES6? Here’s a list of some of my favorites:

- **Arrow functions** – A short-hand version of an anonymous function.
- **Block-level scope** – ES6 now supports scoping variables to blocks (if, for, while, etc.) using the _let_ keyword.
- **Classes** – ES6 classes provide a way to encapsulate and extend code.
- **Constants** – You can now define constants in ES6 code using the _const_ keyword.
- **Default parameters** – Ever wished that a function parameter could be assigned a default value? You can do that now in ES6.
- **Destructuring** – A succinct and flexible way to assign values from arrays or objects into variables.
- **Generators** – Specialized functions that create iterators using _function\*_ and the _yield_ keyword.
- **Map** – Dictionary type object that can be used to store key/value pairs.
- **Modules** – Provides a modular way of organizing and loading code.
- **Promises** – Used with async operations.
- **Rest parameters** – Replaces the need for using _arguments_ to access functions arguments. Allows you to get to an array representing “the rest of the parameters”.
- **Set** – A collection object that can be used to store a list of data values.
- **Template Strings** – Clean way to build up string values.

Looking through the features a few things may jump out at you. First off, there’s support for classes and class extension. If you’ve been working with a language such as Java, C#, C++, Python or the many others that support classes this will probably be something you welcome with open arms. By having support for classes we can eliminate some of the patterns we’ve used in the past (Revealing Module Pattern, etc.) in many cases since encapsulation of code will now be natively supported.

Several other key features listed include block level scope, different types of collection objects called Map and Set, built-in support for Promises (deferred/async objects), a concise function syntax referred to as arrow functions, default parameter value assignment, plus much more. I’ll be discussing these features in greater detail in future posts.

## Should I Use ES6 Now or Wait?

One of the most frequent questions I get about ES6 in my training and consulting work is, “Should I use ES6 now or wait until it has better support?”. There isn’t a single “correct” answer because it depends upon a range of factors such as:

- Where will your application will be deployed (client-side or server-side)?
- What browsers have to be supported?
- What’s the developer environment look like?
- What tools do developers have access to use (in an enterprise environment for example)
- Are you updating an existing app or starting a new one?

  
The good news is that tools exist that enable you to use ES6 today in a variety of situations. However, you’ll need to factor in your unique environment and application requirements before deciding if you start using ES6 now or wait until later. I’m a big fan of the quote, “Use the right tool for the right job”.

To start to answer the question of whether or not you should use ES6 now or if you should wait, you need to look at where you’ll be using it. Will it be on the server with a framework like Node.js? If that’s the case then you can focus on what the V8 JavaScript engine supports. Will the code be running directly in a browser or embedded in a mobile app container like Cordova? In that case using ES6 may be more of a challenge and has to be thought through more carefully if you plan to use native browser support.

If you’re only updating a portion of an existing ES5/ES3 application then ES6 may not be needed given that most of the code base is already ES5/ES3. You’ll have to make that call. On the flipside, if you’re starting a project from scratch (a “greenfield” project) then I think ES6 should be seriously considered since you’ll be setting up well for the future.

The good news is that native ES6 support in browsers such as Chrome, Firefox, and Opera is getting better and better every week. Although Internet Explorer is playing a bit of catch up, they’re planning ES6 support as well (see [https://status.modern.ie](https://status.modern.ie) for more details). While modern browsers support various ES6 features, ES6 as a whole isn’t quite ready for “prime time” if you need all of the key language features available at once. Here’s a snapshot in time from [http://kangax.github.io/compat-table/es6](http://kangax.github.io/compat-table/es6) that shows the status of some of the ES6 features across browsers. The information in the image will certainly change so check the website for a more up-to-date view.  

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/57c59b2be72b_127DE/image_2.png)

  
You’ll note that Internet Explorer 6-9 aren’t listed in the matrix (by default anyway) since they won’t be getting ES6 features - ever. If you still have to support one or more of those browsers your first thought is probably, “I can’t use ES6!”. Although that appears to be the case initially, it’s not true. I’ll introduce some tools that will let you convert ES6 code back to ES5 so that it works in older browsers. Of course there are always limitations that come up depending on application requirements, but at least you’ll know the alternatives out there which should allow you to make a more educated decision about moving to ES6 or sticking with ES5/ES3 for the time being.

If you’re one of the fortunate developers that can target a modern browser that already has some ES6 support in it, you’ll still find that some of the features aren’t supported. The story is improving every week but if you can’t count on specific features being there then it’s hard to justify moving to ES6 today.

As for me personally, I’m moving to ES6 now and even building some applications today that rely on ES6. Does that mean I’m ignoring all of the older browsers out there? Nope – not at all. There are techniques that can be leveraged to use ES6 today while still generating ES5 code that runs fine in older browsers. Let’s take a look at some of the tools that are available.  
  

## Transpilers – Converting Code from One Syntax to Another

Earlier I mentioned that’s it’s possible to use ES6 today while still targeting older browsers. This is made possible through special converters referred to as “transpilers” (sometimes called “transcoders”) that can convert ES6 code to ES5. By integrating a transpiler into your development workflow you can write ES6 code that automatically gets converted to ES5 code using JavaScript task managers like Grunt or Gulp. Two of the most popular transpilers are:

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/57c59b2be72b_127DE/image_4.png)

- [Traceur](https://github.com/google/traceur-compiler) – Open source transpiler started by Google that maps ES6 to ES5.
- [Babel](https://babeljs.io/) – Open source transpiler that maps ES6 directly to ES5. It outputs the cleanest code in my opinion.  [![image_thumb[1]](/images/blog/getting-started-with-es6-the-next-version-of-javascript/image_thumb%5B1%5D_thumb.png "image_thumb[1]")](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/57c59b2be72b_127DE/image_thumb%5B1%5D_2.png)

In addition to transpilers, you can also use languages such as [TypeScript](http://www.typescriptlang.org/) to write ES6 code that gets converted to ES5 (or even ES3). TypeScript is a superset of JavaScript that lets you write “typed” ES6 code (define numbers, strings, booleans, etc.) while still allowing it to work in any browser out there by “compiling” it to ES5/ES3. I’ll be showing TypeScript code as well in this series when it applies to a specific ES6 feature.

In the next post in this series I’ll discuss how to get started using transpilers since I think they’re essential to understand and integrate into your workflow if you want to start using ES6 today.

## Browser-based ES6 Playgrounds

  
In addition to the transpilers mentioned above, there are also sites and browser extensions available that let you play around with ES6 directly in the browser:

- [ES6 Repl](https://chrome.google.com/webstore/detail/es6-repl/alploljligeomonipppgaahpkenfnfkn?utm_source=chrome-ntp-icon) – Chrome extension that allows you to work with ES6 code directly in the Chrome developer tools.
- [ES6 Fiddle](http://www.es6fiddle.com/) – Website that allows you to type in ES6 code and have it converted to ES5.
- [Traceur Transcoding Demo](https://google.github.io/traceur-compiler/demo/repl.html#) – ES6 playground based on Traceur.
- [Babel REPL](https://babeljs.io/repl/) – ES6 playground based on Babel.
- [TypeScript Playground](http://www.typescriptlang.org/Playground) – TypeScript playground that converts code to ES5.

## ES6 Resources

In the posts that follow I’ll be discussing ES6 features and showing how they can be used. In the meantime I think it’s important to know about the different resources that are out there. Here’s a list of some sites that I refer to often:

- [ES6 Language Specification](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) – The spec that defines all of the planned features in ES6. An unofficial HTML version can be [found here](https://people.mozilla.org/~jorendorff/es6-draft.html).
- [ES6 Features in One Page](http://espadrine.github.io/New-In-A-Spec/es6/) – Short synopsis of key ES6 features.
- [ES6 Features](https://github.com/lukehoban/es6features) – Quick look at ES6 features by Luke Hoban.
- [ES.next Showcase –](https://github.com/sindresorhus/esnext-showcase) List of projects that are using or planning to use ES6.
- [ECMAScript 6 Support in Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla) – Details about ES6 support in Firefox.
- [ES6 Browser Support Matrix](http://kangax.github.io/compat-table/es6) – Matrix showing ES6 support across browsers and more.
- [Understanding ECMAScript 6](https://leanpub.com/understandinges6/read) – Online book by Nicholas C. Zakas.
- [ES6 Samples](https://github.com/DanWahlin/ES6Samples) – A repository of samples I’ve put together that will continue to be enhanced and extended over time.

## Conclusion

  
Although ES6 still has a ways to go as far as browser support,  I’m excited about the different features it offers and the future of JavaScript development. Whether or not you plan on using it right away, it’s important to understand what it offers so that you’re prepared and ready for the (near) future. While this post discussed some of the factors to consider before making the jump to ES6 and covered a few features, tools, and resources, there’s a lot more to discuss.

Stay tuned for the next post covering ES6 tools and how they can be used to write ES6 code today while still supporting a variety of browsers.
