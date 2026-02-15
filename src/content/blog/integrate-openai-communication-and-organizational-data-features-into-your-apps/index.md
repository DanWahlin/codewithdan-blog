---
title: "Integrate OpenAI, Communication, and Organizational Data Features into Your Apps"
date: 2023-07-11
categories: 
  - "microsoft-cloud"
tags: 
  - "ai"
  - "azure-active-directory"
  - "azure-communication-services"
  - "azure-openai"
  - "communication"
  - "microsoft-graph"
  - "openai"
  - "organizational-data"
coverImage: "small-overview-ai-acs-graph.webp"
---

Artificial intelligence, communication, and organizational data are three pillars that can help take your custom Line of Business (LOB) applications to the next level. Each pillar brings unique capabilities to the table and enhances the functionality, usability, and productivity of applications and users. In this post you'll learn more about these three pillars and how they can be integrated into apps using Microsoft Cloud services such as Azure OpenAI, Azure Communication Services (ACS), and Microsoft Graph. After you learn about the pillars, you can get hands-on experience provisioning cloud services and working with code in a hands-on tutorial available at [https://aka.ms/openai-acs-msgraph](https://aka.ms/openai-acs-msgraph).   
  
To get started, let's look at a high-level overview of the application.

It's composed of the following parts:  

- A front-end application that handles rendering the UI.

- A back-end API that provides data and other functionality to the front-end.

- A PostgreSQL database that stores customers, orders, and reviews.

- Microsoft Cloud services such as Azure OpenAI, Azure Communication Services, and Microsoft Graph.

The overall goal of the application is to enhance user productivity by simplifying processes, enhancing communication, and bringing organizational data directly into the application to avoid user context shifts.

If you'd like to see the app in action and understand how AI, Communication, and Organizational are used, check out the following talk I gave at the ng-conf 2023 conference:

**Thinking Outside the Box: Taking Your LOB Apps to the Next Level**

https://www.youtube.com/watch?v=TZnMTICby5E

Let's break down each of the three pillars used in the application.  

**Integrating AI**  

In the fast moving world of digital transformation, optimizing applications with leading-edge technologies is essential for any business looking to stay competitive. Among these technologies, Artificial Intelligence (AI), efficient communication tools, and seamless integration of organizational data are key factors that redefine user interaction, boost productivity, and simplify processes.  

[Azure OpenAI](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/?WT.mc_id=m365-94501-dwahlin) provides a cutting-edge AI service that can bring powerful features to your applications while adding [privacy and security guarantees](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy). For example, it can convert natural language queries into SQL, making complex databases accessible to non-technical users without the need for intricate SQL knowledge. This not only bridges the knowledge gap but also accelerates decision-making processes. However, it's essential to apply this type of feature mindfully, considering data privacy and security along the way. The adage, "just because you can doesn't mean you should" applies to this scenario as well as several others.

  
Azure OpenAI also revolutionizes communication workflows, by generating contextually appropriate email or SMS messages based on user-defined rules. This function fast-tracks the message creation process and maintains consistency across communication, greatly enhancing productivity.

In addition to natural language to SQL and AI completions features, Azure OpenAI can also be [customized to your unique business data](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/use-your-data?WT.mc_id=m365-94501-dwahlin), enabling contextually accurate responses from extensive sources such as product manuals or FAQs. For example, if a company hosts a large collection of product manuals, Azure OpenAI can help users navigate the data by simply asking questions. Instead of scrolling through a large product manual, a customer service agent can ask a question and have Azure OpenAI return the answers they need.  
  
**Integrating Communication**  

When it comes to communication features, [Azure Communication Services (ACS)](https://learn.microsoft.com/azure/communication-services/?WT.mc_id=m365-94501-dwahlin) adds an extra layer of real-time communication capabilities, making it possible to add phone calls, live chat, audio/video calls, and email and SMS messaging into your applications. For example, you might find that users are constantly making phone calls or sending messages as they interact with an application. Why not allow them to do that directly in the app so that they stay focused and avoid context switching? With ACS you can integrate key communication features that users need to collaborate with employees and customers. This can be done using SDKs and components that can help simplify the development process.

  
**Integrating Organizational Data**  
  
In addition to AI and communication features, you can also integrate organizational data stored within companies directly into custom applications using [Microsoft Graph](https://learn.microsoft.com/en-us/graph/overview?WT.mc_id=m365-94501-dwahlin) and Azure Active Directory. This reduces the need for users to switch to their email client, Teams, OneDrive for Business, or other tools and applications to find email messages, chats, files, calendar events, and other pertinent data. This seamless integration of organizational data helps users make informed decisions faster while improving productivity and the user experience along the way.  

**Hands-On Tutorial**  
  
To see these three pillars in action you can explore a new [hands-on tutorial available on Microsoft Learn](https://aka.ms/openai-acs-msgraph). It covers the technologies discussed in this post and provides a [GitHub repository](https://github.com/microsoft/MicrosoftCloud) that you can reference. The tutorial walks you through the process of setting up the required Microsoft Cloud services and discusses the code needed to enable each technology pillar including:  

- **AI**: Enable users to ask questions in natural language and convert their answers to SQL that can be used to query a database, allow users to define rules that can be used to automatically generate email and SMS messages, and learn how natural language can be used to retrieve data from your own custom data sources. Azure OpenAI is used for these features.

- **Communication**: Enable in-app phone calling to customers and Email/SMS functionality using Azure Communication Services.

- **Organizational Data**: Pull in related organizational data that users may need (documents, chats, emails, calendar events) as they work with customers to avoid context switching. Providing access to this type of organizational data reduces the need for the user to switch to Outlook, Teams, OneDrive, other custom apps, their phone, etc. since the specific data and functionality they need is provided directly in the app. Microsoft Graph and Microsoft Graph Toolkit are used for this feature.  
    

**Conclusion**  
  
Harnessing the capabilities of AI, enhancing communication, and integrating organizational data are key to elevating Line of Business (LOB) applications. By using Microsoft Cloud services such as Azure OpenAI, Azure Communication Services (ACS), and Microsoft Graph, you can create more functional, user-friendly, and productive applications. For more information, refer to the [hands-on tutorial](https://aka.ms/openai-acs-msgraph) as well as the following documentation and training content.  

Found this information useful? Please share it with others and follow me to get updates:  

- Twitter - [https://twitter.com/danwahlin](https://twitter.com/danwahlin)

- LinkedIn - [https://www.linkedin.com/in/danwahlin](https://www.linkedin.com/in/danwahlin)

  
**Documentation**  

- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/?WT.mc_id=m365-94501-dwahlin)

- [Azure OpenAI on your data](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/use-your-data?WT.mc_id=m365-94501-dwahlin)

- [Azure Communication Services Documentation](https://learn.microsoft.com/en-us/azure/communication-services/?WT.mc_id=m365-94501-dwahlin)

- [Microsoft Cloud for Developers Hub](https://aka.ms/microsoft-cloud)

- [Microsoft Graph Documentation](https://learn.microsoft.com/en-us/graph/overview?WT.mc_id=m365-94501-dwahlin)

- [Microsoft Graph Toolkit Documentation](https://learn.microsoft.com/en-us/graph/toolkit/overview?WT.mc_id=m365-94501-dwahlin)

- [Microsoft Teams Developer Documentation](https://learn.microsoft.com/en-us/microsoftteams/platform/?WT.mc_id=m365-94501-dwahlin)

  
**Training Content**  

- [Apply prompt engineering with Azure OpenAI Service](https://learn.microsoft.com/en-us/training/modules/apply-prompt-engineering-azure-openai//?WT.mc_id=m365-94501-dwahlin)

- [Get started with Azure OpenAI Service](https://learn.microsoft.com/en-us/training/modules/get-started-openai/?WT.mc_id=m365-94501-dwahlin)

- [Introduction to Azure Communication Services](https://learn.microsoft.com/en-us/training/modules/intro-azure-communication-services/?WT.mc_id=m365-94501-dwahlin)

- [Microsoft Graph Fundamentals](https://learn.microsoft.com/en-us/training/paths/m365-msgraph-fundamentals/?WT.mc_id=m365-94501-dwahlin)

- [Video Course: Microsoft Graph Fundamentals for Beginners](https://learn.microsoft.com/en-us/shows/beginners-series-to-microsoft-graph/?WT.mc_id=m365-94501-dwahlin)

- [Explore Microsoft Graph scenarios for JavaScript development](https://learn.microsoft.com/en-us/training/paths/m365-msgraph-scenarios/?WT.mc_id=m365-94501-dwahlin)

- [Explore Microsoft Graph scenarios for ASP.NET Core development](https://learn.microsoft.com/en-us/training/paths/m365-msgraph-dotnet-core-scenarios/?WT.mc_id=m365-94501-dwahlin)

- [Get started with Microsoft Graph Toolkit](https://learn.microsoft.com/en-us/training/modules/msgraph-toolkit-intro/?WT.mc_id=m365-94501-dwahlin)

- [Build and deploy apps for Microsoft Teams using Teams Toolkit for Visual Studio Code](https://learn.microsoft.com/en-us/training/paths/m365-teams-toolkit-vsc/?WT.mc_id=m365-94501-dwahlin)
