---
title: "ng-conf Talk: Mastering the Subject - Communication Options in RxJS"
date: 2019-05-08
categories: 
  - "angular"
  - "rxjs"
tags: 
  - "asyncsubject"
  - "behaviorsubject"
  - "eventbus"
  - "observableservice"
  - "observablestore"
  - "replaysubject"
  - "subject"
coverImage: "mastering-the-subject-talk-ng-conf-2019.png"
---

![](/images/blog/ng-conf-talk-mastering-the-subject-communication-options-in-rxjs/2019-05-08_23-01-01-1024x574.webp)

If you ever get a chance to attend the **[ng-conf conference](https://ng-conf.org)** in Salt Lake City, Utah I highly recommend it. It's one of my favorite conferences to attend and speak at due to the great content, huge community of developers, and many fun events throughout the week. The conference organizers do a great job putting on the event.

This year I had the opportunity to do a 2-day workshop with my good friend **[John Papa](https://twitter.com/john_papa)** on Angular Architecture concepts. We had a very interactive group of nearly 200 people in the workshop and enjoyed sharing project battle stories, best practices, and techniques that should be considered when planning and building Angular applications. It was a fun 2-day event and I'm already looking forward to next year's workshop.

In addition to the workshop, I also gave a talk titled **[Mastering the Subject - Communication Options in RxJS](https://www.youtube.com/watch?v=_q-HL9YX_pk)**. The talk introduced different [**RxJS**](https://rxjs.dev/) subject options such as **Subject**, **BehaviorSubject**, **ReplaySubject**, and **AsyncSubject** and discussed patterns to communicate between different components in an application and even between services. I focused on **Event Buses**, **Observable Services**, and briefly mentioned my **[Observable Store](https://github.com/DanWahlin/Observable-Store)** state management solution (which provides a simple yet powerful way to add state management into any type of front-end project - Angular/React/Vue or anything else). You can watch the talk below.

## Mastering the Subject - Communication Options in RxJS

<iframe class="video-player" src="https://www.youtube.com/embed/_q-HL9YX_pk" width="300" height="150" frameborder="0" allowfullscreen="allowfullscreen"></p> <p></iframe>

The code for the various topics covered can be [found here](https://github.com/danwahlin/angular-architecture). This code is part of our [Angular Architecture training course](https://codewithdan.com/products/angular-architecture) and also used in my [Angular Architecture and Best Practices](https://blog.codewithdan.com/new-pluralsight-course-angular-architecture-and-best-practices/) video course on Pluralsight.
