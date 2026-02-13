---
title: "Registering a Custom AngularJS Application with Azure Active Directory"
date: 2014-12-07
categories: 
  - "net"
  - "activedirectory"
  - "angularjs"
  - "azure"
  - "cloud"
  - "javascript"
  - "office365"
  - "spa"
---

If you’re working with Azure and need to add authentication and identity management into an application look no further than [Azure Active Directory](http://azure.microsoft.com/en-us/services/active-directory/) (AAD). AAD provides a robust set of services for single sign-on, authentication, multi-factor authentication, and more. Rather than setting up a custom authentication provider for an app, you can leverage existing functionality provided by AAD.

To associate a custom application with AAD you first need to register it. If you’ve ever registered a custom app with Facebook, Twitter, or another service you’ll find the AAD app registration process to be quite similar. When you register your application, AAD will generate a client ID and password that can be configured in your app and act as  a “hook” between the two. Once that’s done the application can direct all authentication actions to AAD and upon successful authentication, AAD can redirect the user back to a page in your custom app. This causes identity and access tokens to be provided to your application by AAD. An identity token has information about a given authenticated user (in addition to other details) while an access token provides temporary access to a secured resource (such as Office 365 services) that is also registered with AAD.

In a [previous post](https://weblogs.asp.net/dwahlin/building-applications-with-angularjs-azure-active-directory-and-office-365-sharepoint) I discussed a series of articles that I’m writing about AngularJS, Azure Active Directory, and Office 365/SharePoint for [itunity.com](http://www.itunity.com/). The first article introduced the application and provided an overview of the technologies used while the second article walks through how to register the custom application with AAD. Although I can’t post the entire article, here’s a snippet from it with a link to the complete article below.

## Integrating AngularJS with Azure Active Directory and Office 365/SharePoint, Part 2  

[Part 1](http://www.itunity.com/article/integrating-angularjs-azure-active-directory-office-365sharepoint-part-1-622) of this article series introduced a stand-alone Expense Manager application built using AngularJS, Azure Active Directory, and the Office 365/SharePoint APIs. The overall scenario discussed throughout the series revolves around integrating data from the cloud into an application that can stand on its own and run gracefully in desktop browsers and mobile/tablet browsers. If you haven't read through [Part 1](http://www.itunity.com/article/integrating-angularjs-azure-active-directory-office-365sharepoint-part-1-622), I encourage you to read it first before going through this article since it provides additional context about the application and the technologies used to build it. If you're new to Microsoft Azure or Office 365 cloud services, I also recommend that you learn more about them at [http://azure.microsoft.com](http://azure.microsoft.com/) and [http://products.office.com/business/enterprise-productivity-tools](http://products.office.com/business/enterprise-productivity-tools).

One of the essential requirements that enterprise applications (and many non-enterprise applications) have is authentication and identity management. Although you can certainly use on-premise deployments of Active Directory (AD) or another custom security provider, Azure Active Directory (AAD) integrates directly with Office 365/SharePoint APIs (in addition to several others) and lets you harness the power of the cloud. In this article, you'll see how a custom application such as the Expense Manager application discussed in Part 1 can be registered with Azure Active Directory so that users can be authenticated. In the next article in the series, we'll explore the AAD code that's required and see how it plugs into an ASP.NET MVC application.

So what is Azure Active Directory and how do you get started using it? In a nutshell, it provides "Identity and Access Management for the Cloud" (see [http://azure.microsoft.com/services/active-directory](http://azure.microsoft.com/services/active-directory/) for additional details). By using the Azure management website, you can setup and integrate AAD authentication and identity management into custom applications and also use it to secure Office 365/SharePoint deployments. AAD has many additional features, but the Expense Manager application discussed in this series uses it strictly for authentication purposes so that Office 365/SharePoint lists can be accessed and modified.

You can manage your Azure account and AAD functionality by going to [https://manage.windowsazure.com](https://manage.windowsazure.com/). A new Azure management portal ([https://portal.azure.com](https://portal.azure.com/)) is also available but it's currently in beta (as I’m writing this article) and doesn't offer AAD features yet. It's important to point out that going through the Azure management site isn't the only solution for registering a custom application with AAD so that users can authenticate. When working with Office 365/SharePoint APIs, you can simplify the overall process by using the Microsoft Office 365 API Tools, which is another topic that will be covered in this article.

Let's get started by taking a look at how to register a custom application with AAD using the Azure management site. Once you see how to manually register an application with AAD, you'll then learn about the Microsoft Office 365 API Tools and see how they can be installed and used to register an application from within Visual Studio.  

### Registering an application with Azure Active Directory  

In order to add AAD authentication functionality into the Expense Manager application (or any custom application), it has to be registered with AAD. The standard way to register an application is to login to your Azure account ([https://manage.windowsazure.com](https://manage.windowsazure.com/)) and click the _Active Directory_ item on the left.  

[](http://www.itunity.com/content/content/720/wahlin_aad-o365tools_1.png)

Figure 1: Login to Azure and click Active Directory to begin the process of registering an application with AAD  

Once you click on Active Directory in the Azure management site, the next screen lets you select the directory that the application should be associated with. By default you'll see a _Default Directory_ entry (Figure 2) unless you've created a custom directory.  

[](http://www.itunity.com/content/content/720/wahlin_aad-o365tools_2.png)

Figure 2: Select the directory that your application should be associated with  

Read the full article at [http://www.itunity.com/article/integrating-angularjs-o365-aad-registering-custom-app-720](http://www.itunity.com/article/integrating-angularjs-o365-aad-registering-custom-app-720 "http://www.itunity.com/article/integrating-angularjs-o365-aad-registering-custom-app-720").
