---
title: "Maximize Your Company's Productivity and Potential with the Power of Real-Time Collaboration & Communication"
date: 2023-01-03
categories: 
  - "collaboration"
  - "microsoft-cloud"
tags: 
  - "azure"
  - "azure-communication-services"
  - "fluid-framework"
  - "microsoft-365"
  - "microsoft-teams"
  - "real-time-collaboration"
  - "real-time-communication"
---

[![Two people collaborating together. This is much more challenging with employees (and customers) working remotely.](/images/blog/maximize-your-companys-productivity-and-potential-with-the-power-of-real-time-collaboration-communication/image-1024x683.webp)](https://blog.codewithdan.com/wp-content/uploads/2023/01/image.png)

If you're like most people, you use several custom applications every day at work to get things done. You're entering data, viewing issues, editing and checking in code, making calls to others to verify process rules, and more. When was the last time you sat down and gave some serious thought to how these applications could be taken to the "next level" though? For example, what if team members could collaborate on the same content and communicate with each other in real-time **directly from your app** (using chat, audio and/or video) without having to switch to another app? Could this same overall concept be applied to applications your customers use to enhance their interactions with your company?

One of the key benefits of real-time data collaboration is the ability for multiple team members to work on content together. With traditional methods, multiple versions of data or a document may be created which ultimately leads to confusion, errors, and a general decrease in productivity. Real-time collaboration allows team members to collaborate on the same content simultaneously, reducing the need to resolve data integrity issues. While some of this work can be done using tools such as Word/Excel Online, Google Docs/Sheets, and other solutions, do you have any custom apps where this type of functionality could be embedded directly in the app?

For example, many years ago I worked on an application that allowed a credit card company to adjust interest rates charged to banks. As a user signed into the app and changed a given interest rate in a data grid, it was important for other users in the app to know about the change since it could impact their decision. Back in those days we used concurrency techniques to manage the problem and notified users about changes others were making. With real-time collaboration, users would be able to see everything "live" and make adjustments to their data as required. Data conflicts still have to be resolved, but users can make more informed decisions directly in the app.

In addition to providing the ability to work on content in real-time, today's "work from home" environment requires that employees communicate and collaborate with team members and customers in real-time. Tools such as Microsoft Teams, Zoom, as well as a slew of other viable options provide this functionality, but what if you could enable this functionality directly in an app to minimize user context shifts as they navigate back and forth between applications? One option would be to pull your app into the communication tool itself. Microsoft Teams (and others) provides support for this functionality (see the [Microsoft Teams App Camp](https://microsoft.github.io/app-camp/) site for a robust set of workshop content that shows how to do this). If you don't want to pull your app into another tool, you can add real-time collaboration directly into the custom app.

For example, assume that a field rep is working remotely to solve a problem and accessing your company app directly on a their tablet. As they have questions they can make a call back to the company directly from the app to get help or report their progress. This simplifies the process for them and reduces the number of context shifts they have to make (from tablet to phone or even from one app to another app on the tablet).

Overall, the addition of real-time collaboration and communication functionality to custom applications can greatly benefit teams, companies, and even customers by improving productivity, enhancing communication and collaboration, and increasing flexibility.

So where do you get started? Here are a few solutions I've been working with lately that provide the functionality you'd need.

## Real-Time Data Collaboration

If you're interested in adding real-time data collaboration into your apps, check out the Fluid Framework at [https://fluidframework.com](https://fluidframework.com). It provides a robust option for embedding real-time data collaboration functionality into apps.

[![](/images/blog/maximize-your-companys-productivity-and-potential-with-the-power-of-real-time-collaboration-communication/image-3-1024x560.webp)](https://blog.codewithdan.com/wp-content/uploads/2023/01/image-3.png)

Their [Quick Start app](https://fluidframework.com/docs/start/quick-start/) provides a simple way to get started and learn the basics.

A more robust sample application that uses the Fluid Framework and other Azure/Microsoft 365 technologies to embed real-time data collaboration into a React app can be found here:  
  
[https://github.com/microsoft/brainstorm-fluidframework-m365-azure](https://github.com/microsoft/brainstorm-fluidframework-m365-azure)

[![](/images/blog/maximize-your-companys-productivity-and-potential-with-the-power-of-real-time-collaboration-communication/BrainstormAppDemo.gif)](https://blog.codewithdan.com/wp-content/uploads/2023/01/BrainstormAppDemo.gif)

## Real-Time Chat/Audio/Video/Phone Collaboration

If you're interested in adding real-time chat and/or audio/video (and more) collaboration directly into your apps, check out [Azure Communication Services](https://learn.microsoft.com/en-us/azure/communication-services/overview) (ACS). It can be used to enable users to call each other in an application, chat, send email and SMS messages, and even make calls directly from an app to phones. You can watch an overview video about ACS here:

https://youtu.be/chMHVHLFcao

A hands-on tutorial that shows how to use ACS to make an audio/video call from an application directly into a Microsoft Teams meeting (including dynamically setting up the meeting using Microsoft Graph) can be found on the [Microsoft Cloud Integration Scenarios](https://microsoft.github.io/MicrosoftCloud/) site:

[https://microsoft.github.io/MicrosoftCloud/tutorials/docs/ACS-to-Teams-Meeting/](https://microsoft.github.io/MicrosoftCloud/tutorials/docs/ACS-to-Teams-Meeting/)

[![](/images/blog/maximize-your-companys-productivity-and-potential-with-the-power-of-real-time-collaboration-communication/image-2-1024x479.webp)](https://blog.codewithdan.com/wp-content/uploads/2023/01/image-2.png)

## Conclusion

While not every application needs real-time collaboration and communication functionality, there are many apps that can benefit from enhancing employee and customer interactions. Explore some of the options above and see if they're a potential fit to help take your apps to the next level.
