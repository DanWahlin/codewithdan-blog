---
title: "Building Applications with AngularJS, Azure Active Directory, and Office 365/SharePoint"
date: 2014-12-07
categories: 
  - "net"
  - "activedirectory"
  - "angularjs"
  - "azure"
  - "cloud"
  - "javascript"
  - "office365"
  - "sharepoint"
  - "spa"
---

One of my favorite features of Single Page Applications (SPAs) is the ability to integrate data from nearly any backend technology and have it display on a variety devices (desktop browser, mobile, tablet, and more). Whether you’re calling a service like [Firebase](https://www.firebase.com/) or [Azure Mobile Services](http://azure.microsoft.com/en-us/documentation/services/mobile-services/) or hitting a custom REST API, the data that’s returned can be integrated into your SPA regardless of [](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/bc4f2922cfcb_9E75/azure_2.png)the language, technology, or operating system being used on the server.

Some of the backend technologies I’ve been spending a lot of time with from a business perspective lately include [Azure](http://azure.microsoft.com/) and the the [Office 365/SharePoint API](http://msdn.microsoft.com/en-us/office/office365/api/api-catalog). Azure provides a wealth of cloud services such as websites, virtual machines, a cloud-based Active Directory, mobile services, and much more while Office 365/SharePoint provides access to mail, contacts, calendars, files, SharePoint services, and other data services.

We’ve been building AngularJS applications that take advantage of some of the new features provided by these cloud services and writing a series of articles about them for [itunity.com](http://www.itunity.com/) site. The first article is titled [Integrating AngularJS with Azure Active Directory and Office 365/SharePoint, Part 1](http://www.itunity.com/article/integrating-angularjs-aad-office-365sharepoint-part-1-622) and was writing by myself and my good friend [Spike Xavier](http://transmissionit.com/). I’m not able to post the entire article here, but here’s a snippet from it. The full article can be found on the [itunity.com](http://www.itunity.com/article/integrating-angularjs-aad-office-365sharepoint-part-1-622) site.  

## Integrating AngularJS with Azure Active Directory and Office 365/SharePoint, Part 1  

Data is everywhere in today’s business environment and employees expect to be able to access it regardless of where it lives. They don’t care if it’s stored in a database, retrieved from a service, found in a SharePoint list or library, or stored somewhere else up in the cloud. Regardless of where the data lives, they expect to be able to get to it on any operating system, with any browser, and using any device.

With the popularity of SharePoint across many organizations an enormous amount of business data is added into lists and libraries every day. If employees have access to SharePoint directly on their chosen device then a variety of techniques can be used to expose the data to them ranging from SharePoint pages, Web Parts, App parts, Pages, and more. However, if they won’t always be using SharePoint directly to access the data how can you get it to them? Fortunately, this isn’t a new problem and has been possible for many years using SharePoint Web Services or RESTful services. How does that process change though if you’re using Microsoft Azure, Office 365 and SharePoint?[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/bc4f2922cfcb_9E75/office_5.png)

In this article series, we’ll walk you through the process of creating an external application that can interact with Microsoft Azure Active Directory, Office 365 and SharePoint. The overall goal of the series is to show developers that may be new to SharePoint how they can leverage existing HTML and JavaScript development skills to integrate with Azure and pull Office 365/SharePoint data into custom Web applications.

This first article will discuss whether or not a SharePoint-centric application or external application should be considered. It’ll also introduce an Expense Manager application and explain what it offers. Future articles in this series will discuss the technologies used by the Expense Manager application and dive into how AngularJS can be used to build a single-page application (SPA) that can be used by employees on any device throughout an organization.

Let’s get started by discussing whether an application should be embedded directly into SharePoint or if it should be external.  

### Stand-alone or SharePoint hosted? That is the question!  

While it’s true that SharePoint uses SQL Server under the covers, SharePoint itself is NOT a relational database. It’s ultimately up to the developer to understand how SharePoint works in order to maximize the use of the APIs and interact with the various objects and data.

Why is this important? It’s important because SharePoint is a robust platform that can be used to build a variety of applications that run inside or outside of SharePoint. With support for RESTful services, developers can leverage their existing Web development skills to enhance, expand and extend what SharePoint can do. A fundamental understanding of the building blocks of SharePoint will save a lot of time and frustration and allow developers to do what they do best while allowing SharePoint to do what it does best.

Read the full article at [http://www.itunity.com/article/integrating-angularjs-aad-office-365sharepoint-part-1-622](http://www.itunity.com/article/integrating-angularjs-aad-office-365sharepoint-part-1-622 "http://www.itunity.com/article/integrating-angularjs-aad-office-365sharepoint-part-1-622").
