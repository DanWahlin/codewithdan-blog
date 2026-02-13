---
title: "Video: Show a user's emails in an ASP.NET Core app using Microsoft Graph"
date: 2022-02-01
categories: 
  - "asp-net-core"
  - "microsoft-graph"
tags: 
  - "c"
  - "microsoft-identity"
  - "microsoft-learn"
  - "sdk"
coverImage: "aspnet-core-ms-graph.png"
---

I've been working a lot with [.NET Core](https://dot.net) and [Microsoft Graph](https://aka.ms/ms-graph-docs) lately and decided to put together a short video based on a [Microsoft Learn module](https://aka.ms/learn-msgraph-email) covering how the technologies can be used together. If you haven't used Microsoft Graph before, it provides a secure, unified API to access organizational data and intelligence (data stored in Microsoft 365 for example).  
  
So why would you ever want to access a signed in user's emails and include them in your custom app? The simple answer is, "Bring organizational data where your users need it everyday!". Instead of users switching from your app to find a relevant email, calendar event, Microsoft Teams chat (and more) by jumping between various productivity apps, you can pull that type of data directly into your custom app. This allows users to work more efficiently and make more informed decisions all while minimizing context shifts.

In this video I'll introduce you to:

- The role of security in making Microsoft Graph calls.
- Microsoft Identity and Microsoft Graph Middleware configuration.
- The role of permissions/scopes and access tokens.
- The Microsoft Graph .NET Core SDK and how it can be used.
- How to create reusable classes that handle making Microsoft Graph calls.
- Dependency injection and how it can be used to access a GraphServiceClient object.
- How to retrieve a batch of email messages using the UserMessagesCollectionRequest class.

## Show a user's emails in an ASP.NET Core app using Microsoft Graph

https://www.youtube.com/watch?v=acnFrkBL1kE
