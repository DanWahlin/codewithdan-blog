---
title: "Adding Azure Active Directory Configuration Code and Assemblies into an AngularJS/ASP.NET MVC Application"
date: 2015-01-25
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

In a [previous post](http://weblogs.asp.net/dwahlin/registering-a-custom-angularjs-application-with-azure-active-directory) I discussed the process for registering an application with [Azure Active Directory](http://azure.microsoft.com/en-us/services/active-directory/) (AAD) so that users can be authenticated. AAD supports a wide range of features that can be used to perform authentication, authorization, and claims-based security tasks.

Once an application has been registered with AAD you’ll need to add configuration code into the application’s web.config file, add related NuGet packages, and add custom C# code into the application in order to take advantage of AAD authentication functionality. In Part 3 of an article series I’m writing for [http://itunity.com](http://itunity.com) I discuss these tasks and walk-through the complete process. Here’s an excerpt from the article.  

## Integrating AngularJS with Azure Active Directory and Office 365/SharePoint, Part 3 – Adding AAD Configuration and Assemblies into an Application

You can choose from many different techniques to authenticate users in an application. You can build a custom solution using a file or database, you can use Active Directory, you can deploy a third-party solution, or you can use a cloud-based service, to name just a few. Every situation is unique so the authentication choice made really depends upon the requirements of the application. In cases where an application can be used from a variety of locations and devices, a cloud-based authentication solution can work quite well.

[Part 2](http://www.itunity.com/article/integrating-angularjs-o365-aad-registering-custom-app-720) of this article series showed the process for registering an application with the [Azure Active Directory](http://azure.microsoft.com/en-us/services/active-directory/) (AAD) cloud service. Once you’ve registered an application, you can configure the Client ID and key created in AAD in your custom application. You can then add AAD assemblies to provide authentication functionality.

In this article, I’ll discuss how to get the necessary configuration and assemblies in place to tie the AngularJS Expense Manager application discussed in [Part 1](http://www.itunity.com/article/integrating-angularjs-aad-office-365sharepoint-part-1-622) to AAD so that users can authenticate into Office 365 services. In Part 4 I will provide a walk-through of the code that needs to be added into the application to enable user authentication with AAD.

Let’s start by discussing the assemblies that need to be installed into the application and how you can simplify that process by using NuGet.  

### Installing the required assemblies using NuGet

Once an application has been registered with AAD (refer to the Part 2 article for step-by-step details on doing that) you can begin the process of integrating AAD authentication into the application. To get started, you’ll need to add several assemblies into your project including some AAD-specific assemblies as well as OWIN assemblies. The AAD assemblies will be used to communicate with AAD while the OWIN assemblies will be used to hook AAD authentication into the custom application. Here’s a step-by-step walkthrough of getting the assemblies into a project.

Create a new ASP.NET MVC application in Visual Studio (the sample application is named “ExpenseManager”). Now select Tools → NuGet Package Manager → Package Manager Console from the Visual Studio menu.

Once the Package Manager Console is open, run the following commands in it to get the necessary assemblies into place as shown in Figure 1. 

Figure 1. Installing NuGet packages using the Package Manager Console.  

Type each of the following commands into the command-prompt area and press Enter to install the specific Nuget package:

Install-Package -Id Microsoft.Owin.Host.SystemWeb  
Install-Package -Id Microsoft.Owin.Security.Cookies  
Install-Package -Id Microsoft.Owin.Security.OpenIdConnect  
Install-Package -Id Microsoft.IdentityModel.Clients.ActiveDirectory

  
After installing the Nuget packages, open the References node in the Solution Explorer and note that several new assemblies have been added that are related to AAD and authentication. Figures 2 and 3 show a few of the assemblies that are added:  

Figure 2. Assemblies related to AAD.

Figure 3. OWIN assemblies.

Now that the essential assemblies are installed, it’s time to add the application’s AAD Client ID and Key into the application. These values are needed to “hook” the application to AAD.

Note that all of the code that follows is from the Expense Manager application that’s available on the [OfficeDev GitHub site](https://github.com/OfficeDev/SP-AngularJS-ExpenseManager-Code-Sample).

Read the full article at [http://www.itunity.com/article/integrating-aad-services-angularjs-office-365-part-3-770](http://www.itunity.com/article/integrating-aad-services-angularjs-office-365-part-3-770 "http://www.itunity.com/article/integrating-aad-services-angularjs-office-365-part-3-770").
