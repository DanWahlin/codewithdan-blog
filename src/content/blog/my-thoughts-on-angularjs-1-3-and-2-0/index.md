---
title: "My Thoughts on AngularJS 1.3 and 2.0"
date: 2014-10-31
categories: 
  - "angularjs"
  - "es6"
  - "javascript"
  - "spa"
---

<script type="text/javascript">// <![CDATA[ document.write(getHtmlFragment('angularjsGetStarted')); // ]]></script>

  
 I've received a ton of questions on [Twitter](http://asp.us7.list-manage.com/track/click?u=65e00aa00c80d98f762ebeb6e&id=4086649803&e=8b4b262c4b) and through email about the AngularJS 2.0 announcement. Questions such as "What's going on with AngularJS?" and "Should I start a new AngularJS 1.3 project when AngularJS 2.0 looks quite different?". Many people are excited about the modern approach the Angular team is taking with 2.0, a few seem to be predicting doom and gloom, and a few more are worried about what they should do.  As a result of all the questions I decided to put together a quick post since 140 characters on Twitter isn’t really enough.

## Stay on 1.3 or Move to Another Framework?

While every situation is different and maintenance certainly has to be evaluated carefully with any software project, I personally like what I've seen so far (2.0 is still very early though and may certainly change) and plan to build SPAs in the near term using Angular 1.3. Why? Because it just came out, it gets the job done very well, I don’t want to jump to another framework at this point (who's to say they won't be making the move to ES6 as well in the near future to stay relevant?), I have confidence in the AngularJS team, and Angular 1.3 makes me more productive. I'll definitely be keeping a close eye on Angular 2.0 though over the next year or so as it develops.

## Jumping to ES6

Yes, AngularJS 2.0 appears to be a big jump from 1.3 - a HUGE jump some might say! But, I think it's necessary to be ready for a future that includes technologies like ECMASCript 6, Web Components, and more. Some of the features currently in 1.3 that will go away in 2.0 disappear "naturally" as a result of ES6 functionality such as modules and classes. That's a good thing in my opinion. New features announced for 2.0 provide a cleaner, more modern way of building Web applications such as moving directives to Web Components (another good thing IMO but will likely cause some app migration work). I'd recommend [reading the post](http://asp.us7.list-manage.com/track/click?u=65e00aa00c80d98f762ebeb6e&id=7aaa402b46&e=8b4b262c4b) from the AngularJS team and taking time to watch some of the videos from [ng-europe](http://asp.us7.list-manage.com/track/click?u=65e00aa00c80d98f762ebeb6e&id=5f1dc3d769&e=8b4b262c4b) (start with [this one](https://www.youtube.com/watch?v=lGdnh8QSPPk) and then watch [this one](https://www.youtube.com/watch?v=gNmWybAyBHI)). I'm excited about what they're planning even if it means extra work may possibly be required down the road to migrate from 1.3 to 2.0 (we don't know how much yet since 2.0 is in the early stages). Syntax changes that ultimately improve the way I write future applications don’t bother me although I acknowledge it can cause extra work and has to be planned for appropriately.

## Things to Consider

Every company will have to consider if they stick with AngularJS 1.3 for awhile or if they jump ship and move to something else. It's not like an app has to move to 2.0 once it finally comes out. But, if part or all of the app has to be ported to a new version at some point then that's something to carefully think over. I've been in the position of maintaining a large number of apps and realize that the decision to stay on 1.3 or go in a different direction is a hard one to make. I can sympathize with companies and developers who are in that position.  
  
I don't know if the migration process will be easy or hard - time will tell. I don't currently like any of the other options any better than Angular 1.3 though (that's a very personal preference ...many other viable and capable solutions certainly exist) which is why I'm OK with using it over the next year. When 2.0 is finally released I'll have to evaluate if I (and my company’s clients) stay on 1.3 or take the time to migrate the app. I won't pretend to know what's best for your company as every company has unique requirements and it’s something

 you have to talk over with your team. There’s no easy answer there and I totally get that. It really boils down to whether or not you're OK with using AngularJS 1.3 for awhile, if you want to learn an entirely different framework (which may possibly shift due to ES6 and other technologies being released), or if you want to write something custom. I'm fine with what Angular 1.3 offers and like the fact that at least I know what to expect (or some of what to expect) when 2.0 is released down the road.  
  
In hindsight (everyone loves to play Monday morning quarterback) I wish a more jQuery-ish approach would've been announced with a 1.x and 2.x branch. That would put to rest many of the version and migration fears that people have. Who knows - maybe the AngularJS team will end up doing something like that given that over 1600 apps inside of Google rely on Angular.

## Change is Guaranteed

My good friend [Shawn Wildermuth](http://asp.us7.list-manage2.com/track/click?u=65e00aa00c80d98f762ebeb6e&id=423aabde3d&e=8b4b262c4b) sums all of this up nicely in his latest post titled, [It is Too Soon to Panic on AngularJS 2.0](http://asp.us7.list-manage1.com/track/click?u=65e00aa00c80d98f762ebeb6e&id=2b7f0732d0&e=8b4b262c4b). The last paragraph in the post states the following (he has a lot of other good points so please read the whole post):  
  
"I don’t know what you should do. I don’t. I won’t pretend to. Keep an open mind and keep your ears open. See where it’s going and under the current and future risks in pinning yourself to the library. You’ll have to hook your wagon to some horse (AngularJS means to Google, ReactJS to Facebook, etc.) But ultimately as I’ve been talking about for years, be prepared for change and look forward to learning what is coming around the corner."  
  
If you work in the Web world you have to expect, be prepared for, and plan on change. Some of the other frameworks out there will likely be changing as well (maybe big changes, maybe small changes) due to the new technologies coming out. If they don’t change they’ll be considered “old” in the near future as ES6 makes its way onto the scene. The challenge is deciding on how you’ll deal with change and the approach to take moving forward. As Shawn points out, no one (including myself) has all the answers. I always go with my gut feeling whenever possible.  It’s quite possible that in a year or so I may do a pivot to another technology. I’ve had to do that many times over my career. At this point I’m happy with what 1.3 has to offer though.

Some will agree with what I say and some will disagree (quite loudly in some cases). That’s part of the fun of being a Web developer.
