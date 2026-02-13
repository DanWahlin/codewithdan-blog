---
title: "New Pluralsight Course: Integrating Angular with ASP.NET Core RESTful Services"
date: 2017-09-05
categories: 
  - "net"
  - "angular"
  - "asp-net-core"
  - "asp-net-web-api"
  - "c"
  - "containers"
  - "docker"
  - "ecmascript6"
  - "ef-code-first"
  - "gulp"
  - "javascript"
  - "json"
  - "observables"
  - "pluralsight"
  - "rxjs"
  - "spa"
  - "transpile"
  - "typescript"
---

[![](/images/blog/new-pluralsight-course-integrating-angular-with-asp-net-core-restful-services/integrating-angular-aspnet-core.jpg)](https://www.pluralsight.com/courses/angular-aspnetcore-restful-services?utm_medium=affiliate&utm_source=1457843)

I'm excited to announce the release of my new course on [Pluralsight](https://www.pluralsight.com/courses/angular-aspnetcore-restful-services?utm_medium=affiliate&utm_source=1457843) titled [**Integrating Angular with ASP.NET Core RESTful Services**](https://www.pluralsight.com/courses/angular-aspnetcore-restful-services?utm_medium=affiliate&utm_source=1457843)! This course follows up my previous course which focused on [Angular and Node.js](https://www.pluralsight.com/courses/angular-nodejs-restful-services?utm_medium=affiliate&utm_source=1457843). The code in this new class covers ASP.NET Core 2.0 or higher and Angular 4 or higher.

As with my previous course, I'll walk you through the process of using Angular to call into RESTful services and perform CRUD (Create, Read, Update and Delete) operations in an application to allow a user to view and modify data. However, in this course the services are built using C# and ASP.NET Core rather than JavaScript and Node.js.

If you've asked the following questions then this course will provide the information you need:

- What's involved with creating a RESTful service using C# and ASP.NET Core?
- How do you use ASP.NET Core middleware?
- How do you document RESTful services using Swagger?
- How do Angular services work?
- How should Angular modules be organized?
- How do Observables and RxJS fit in with async operations?
- How do you use Angular's Http service to make async calls? (note that code showing how to use the new Angular 4.3+ HttpClient is also included in the course project)
- How do you create and validate Angular forms?
- What's the difference between template-drive and reactive forms?
- How do you work with headers and page data?
- What are CSRF attacks and how can I mitigate them with ASP.NET Core middleware?

Although the course uses ASP.NET Core RESTful services, the Angular concepts covered throughout the course can be used to call any RESTful service regardless of technology (if you're interested in Angular/Node.js check out my [previous course](https://www.pluralsight.com/courses/angular-nodejs-restful-services?utm_medium=affiliate&utm_source=1457843))!

If you're a [Pluralsight](https://www.pluralsight.com/courses/angular-aspnetcore-restful-services?utm_medium=affiliate&utm_source=1457843) subscriber I sincerely hope you enjoy the course. It was a lot of fun to build and film! Note that if you're not a Pluralsight subscriber, you can still watch 3 hours of the course for free with their [10-day trial](https://billing.pluralsight.com/individual/checkout/account-details?sku=IND-Y-PLUS-FT&utm_medium=affiliate&utm_source=1457843).

Here's a synopsis of the key topics as well as the course modules.

# Integrating Angular with ASP.NET Core RESTful Services

Learn how to build an Angular and ASP.NET Core application that can perform create, read, update and delete (CRUD) operations. Topics covered include building RESTful services with C# and ASP.NET Core, manipulating data in a relational database (Sqlite, SQL Server, PostgreSQL or any relational database supported by Entity Framework Core can also be used) and consuming services with Angular.

## **Key Angular Topics Covered:**

- TypeScript and how it can be used in Angular applications
- Code organization with Angular modules
- The role of ES2015 module loaders in Angular applications
- Promises versus Observables
- Learn how Observables work (a nice visual explanation is shown) and how to subscribe to them
- Learn how to create and use Angular services
- Angular's Http service and how it can be used to call into RESTful services. The course application also includes code to show how to use the new HttpClient as well if you're on Angular 4.3+.
- Differences between Template-driven and Reactive forms in Angular
- Directives used in Template-driven forms and how to use them for two-way data binding
- Directives and code used in Reactive forms
- Form validation techniques and custom validators
- How to build custom components and leverage Input and Output properties
- Working with headers sent by the server
- Building a custom pagination component
- CSRF attacks and how Angular can help

## **Key ASP.NET Core Topics Covered:**

- Understand GET, POST, PUT and DELETE and the role each plays with RESTful services
- Use ASP.NET Core middleware
- Create RESTful services capable of supporting CRUD operations using C# and ASP.NET Core
- Use Entity Framework Core for data access
- Paging data
- Working with headers on the server-side and client-side
- Preventing CSRF attacks

## **Course Modules:**

1. **Course Introduction**
    - Pre-requisites to Maximize Learning
    - Learning Goals
    - Server-side Technologies and Concepts
    - Client-side Technologies and Concepts
    - Running the Application on Windows
    - Running the Application on Mac
    - Running the Application with Docker
2. **Exploring the Angular and ASP.NET Core Application**
    - Getting Started - Using a Seed Project
    - Getting Started - Using the dotnet CLI
    - Getting Started - Using the Angular CLI
    - Exploring the Project Structure
    - Application Packages and Modules
    - Configuring the ES Module Loader
    - Angular Modules, Components and Services
3. **Retrieving Data Using a GET Action**
    - Injecting Data Repository and Logging Functionality
    - Creating a GET Action to Return Multiple Customers
    - Creating a GET Action to Return States
    - Creating a GET Action to Return a Single Customer
    - Making GET Requests with an Angular Service
    - Subscribing to an Observable in a Component
    - Displaying Customers in a Grid
    - Displaying a Customer in a Form
    - Converting to a Reactive Form
4. **Inserting Data Using a POST Action**
    - Creating a POST Action to Insert a Customer
    - Making a POST Request with an Angular Service
    - Modifying the Customer Form to Support Inserts
    - Exploring the Reactive Form
    - Modifying the Reactive Form submit() Function
5. **Updating Data Using a PUT Action**
    - Creating a PUT Action to Update a Customer
    - Making a PUT Request with an Angular Service
    - Modifying the Customer Form to Support Updates
    - Exploring the Reactive Form
    - Viewing Swagger Documentation
6. ****Deleting Data Using a DELETE Action****
    - Creating a DELETE Action to Delete a Customer
    - Making a DELETE Request with an Angular Service
    - Modifying the Customer Form to Support Deletes
    - Exploring the Reactive Form
    - Viewing Swagger Documentation
7. ****Data Paging, HTTP Headers and CSRF****
    - Adding a Paging Header to a RESTful Service Response
    - Accessing Headers and Data in an Angular Service
    - Adding Paging Support to a Component
    - Adding a Paging Component
    - CSRF Overview
    - Adding CSRF Functionality
    - Using a CSRF Token in an Angular Service
