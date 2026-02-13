---
title: "Learning AngularJS by Example – The Customer Manager Application"
date: 2014-09-01
categories: 
  - "net"
  - "ajax"
  - "angularjs"
  - "animations"
  - "architecture"
  - "asp-net-web-api"
  - "breeze"
  - "c"
  - "css"
  - "databinding"
  - "ef-code-first"
  - "express"
  - "html5"
  - "javascript"
  - "json"
  - "mongodb"
  - "node-js"
---

<script type="text/javascript">// <![CDATA[ document.write(getHtmlFragment('angularjsGetStarted')); // ]]></script>

**Updated: 9/23/2014  
  
**

I’m always tinkering around with different ideas and toward the beginning of 2013 decided to build a sample application using [AngularJS](http://angularjs.org) that I call **[Customer Manager](https://github.com/DanWahlin/CustomerManagerStandard)**. The goal of the application is to highlight a lot of the different features offered by AngularJS and demonstrate how they can be used together. I also wanted to make sure that the application was approachable by people new to Angular since I’ve never found overly complex applications great for learning new concepts.

The application initially started out small and was used in my [AngularJS in 60-ish Minutes](http://weblogs.asp.net/dwahlin/archive/2013/04/12/video-tutorial-angularjs-fundamentals-in-60-ish-minutes.aspx) video on YouTube but has gradually had more and more features added to it and will continue to be enhanced over time. It’s used in a new “end-to-end” instructor-led training course my company wrote for AngularJS as well as in some video courses that will be coming out. Here’s a quick look at what the application home page looks like:  
  
  

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_2.png)  
  

In this post I’m going to provide an overview about how the application is organized, back-end options that are available, and some of the features it demonstrates. I’ve already written about some of the features so if you’re interested check out the following posts:

- [Building an AngularJS Modal Service](http://weblogs.asp.net/dwahlin/archive/2013/09/18/building-an-angularjs-modal-service.aspx)
- [Building a Custom AngularJS Unique Value Directive](http://weblogs.asp.net/dwahlin/archive/2013/09/24/building-a-custom-angularjs-unique-value-directive.aspx)
- [Using an AngularJS Factory to Interact with a RESTful Service](http://weblogs.asp.net/dwahlin/archive/2013/08/16/using-an-angularjs-factory-to-interact-with-a-restful-service.aspx)

Two versions of the application are available on Github including a “standard” version that uses out-of-the-box AngularJS features and a custom version that provides custom routing and dynamic loading of controller scripts:  
  
CustomerManagerStandard:  [https://github.com/DanWahlin/CustomerManagerStandard](https://github.com/DanWahlin/CustomerManagerStandard "https://github.com/DanWahlin/CustomerManagerStandard")

CustomerManager with Custom Routing: [https://github.com/DanWahlin/CustomerManager](https://github.com/DanWahlin/CustomerManager "https://github.com/DanWahlin/CustomerManagerStandard")

# Key Features

  
The Customer Manager application certainly doesn’t cover every feature provided by AngularJS but does provide insight into several key areas. Here are a few of the features it demonstrates with information about the files to look at if you want more details:

1. Using factories and services as re-useable data services (see the **app/customersApp/services** folder)
2. Creating custom directives (see the **app/customersApp/directives** and **app/wc.directives/directives** folder)
3. Custom paging (see **app/views/customers/customers.html** and **app/customersApp/controllers/customers/customersController.js**)
4. Custom filters (see **app/customersApp/filters**)
5. Showing custom modal dialogs with a re-useable service (see **app/customersApp/services/modalService.js**)
6. Making Ajax calls using a factory (see **app/customersApp/services/customersService.js**)
7. Using Breeze to retrieve and work with data (see **app/customersApp/services/customersBreezeService.js**). Switch the application to use the Breeze factory by opening **app/customersApp/config.js** and changing the **useBreeze** property to **true**.
8. Intercepting HTTP requests to display a custom overlay during Ajax calls (see **app/wc.directives/directives/wcOverlay.js**)
9. Custom animations using the GreenSock library (see **app/customersApp/animations/listAnimations.js**)
10. Creating custom AngularJS animations using CSS (see **Content/customersApp/animations.css**)
11. JavaScript patterns for defining controllers, services/factories, directives, filters, and more (see any JavaScript file in the app folder)
12. Card View and List View display of data (see **app/customersApp/views/customers/customers.html** and **app/customersApp/controllers/customers/customersController.js**)
13. Using AngularJS validation functionality (see **app/customersApp/views/customerEdit.html**, **app/customersApp/controllers/customerEditController.js**, and **app/customersApp/directives/wcUnique.js**)
14. Nesting controllers
15. More…

# Application Structure

The structure of the application is shown to the right. The  homepage is **index.html** and is located at the root of the application folder. It defines where application views will be loaded using the **ng-view** directive and includes script references to AngularJS, AngularJS routing and animation scripts, plus a few others located in the **Scripts** folder and to custom application scripts located in the **app** folder.

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_10.png)

The **app** folder contains all of the key scripts used in the application. There are several techniques that can be used for organizing script files but after experimenting with several of them I decided that I prefer content organized by **module name** (**customersApp** and **wc.directives** are examples of module folder names). Within each module folder I follow a convention such as **controllers**, **views**, **services**, etc. Individual features are identified within a convention folder by using additional subfolders such as **customers** and **orders**. Doing that helps me find things a lot faster due to mixing the convention/feature approach.

I’m a huge believer in having some conventions in place especially when it comes to team development. Having managed several development teams over the years I learned that consistency across projects is good since people come and go on teams and taking that approach allows files to be categorized and located easily (such as controllers and services). If you’re new to an app (a new hire, production support, a contractor, etc.) and are given a pure feature-based folder structure to work with it can be challenging to find things if you don’t know the app features well since whoever created the folder structure did it based on their way of thinking about the app. If some convention is mixed in with the features it becomes much easier to find things in my opinion and it makes it easier to understand multiple projects – not just one. On the other hand, going with a pure convention-based approach causes challenges with large applications since a **controllers** folder could have a ton of files in it which is why I like to segregate things by module/convention/feature.

There are **MANY** different opinions on this so my recommendation is to go with whatever works best for you. I’m definitely not saying this is “the way”…this is my way. Anyone who says, “You’re doing it wrong!” should be ignored because in my experience these are generally the type of close-minded people you run into who aren’t willing to take time to consider alternatives to their approach. Contrary to what some people think, there is no “one right way” to organize scripts and files. As long as the scripts make it down to the client properly (you’ll likely minify and concatenate them anyway to reduce bandwidth and minimize HTTP calls so the structure is irrelevant to the browser), the way you organize them is completely up to you. Here’s what I ended up doing for this application:

1. Animation code for some custom animations is located in the **app/customersApp/animations** folder. In addition to AngularJS animations (which are defined using CSS in Content/animations.css), it also animates the initial customer data load using a 3rd party script called [GreenSock](http://www.greensock.com/).
2. Controllers are located in the **app/customersApp/controllers** folder. Some of the controllers are placed in subfolders based upon the their feature/functionality while others are placed at the root of the **controllers** folder since they’re more generic:
    
      
    [](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_6.png)
    
3. The **directives** folder contains the custom directives created for the application. Directives that can be used across projects are placed in the **wc.directives/directives** folder which represents the module/convention approach. 
4. The **filters** folder (**app/customersApp/filters**) contains the custom filters created for the application that filter city/state and product information.
5. The **partials** folder contains partial views. This includes things like modal dialogs used in the application.
6. The **services** folder contains AngularJS factories and services used for various purposes in the application. Most of the scripts in this folder provide data/Ajax functionality. Two types of services exist to send and retrieve data to/from a RESTful service. The application uses $http by default but can be switched to use [BreezeJS](http://www.breezejs.com/) (an alternative way to work with data) by updating the config.js file.
7. The **views** folder contains the different views used in the application. Like the controllers folder, the views are organized into subfolders based on their functionality:

> [](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_12.png)

# Back-End Technologies

  
The Customer Manager application ([grab it from Github](https://github.com/DanWahlin/CustomerManagerStandard)) provides two different options on the back-end including **ASP.NET Web API** and **Node.js** so you'll want to select one of them in order to run the application. The ASP.NET Web API back-end uses C# and Entity Framework for data access and stores data in SQL Server (LocalDb). The other option on the back-end is Node.js, Express, and MongoDB.

## Using the ASP.NET Web API Back-End Option

To run the application using ASP.NET Web API/SQL Server back-end open the .sln file at the root of the project in Visual Studio 2012 or higher (the free [Visual Studio 2013 Community Edition](http://www.visualstudio.com/en-us/products/visual-studio-community-vs) version is fine). Press **F5** and a browser will automatically launch and display the application. Under the covers, Entity Framework code first is used to create the database dynamically.

## Using the Node.js Back-End Option

To run the application using the Node.js/MongoDB back-end follow the steps listed in the [readme](https://github.com/DanWahlin/CustomerManagerStandard) on the Github site.

# Front-End Technologies

  
The Customer Manager application uses the following frameworks and libraries on the front-end:

1. [AngularJS](http://angularjs.org) (with the ngRoute and ngAnimation modules)
2. [Bootstrap](http://getbootstrap.com/)
3. [Angular UI BootStrap](http://angular-ui.github.io/bootstrap/)
4. [GreenSock Animations](http://www.greensock.com/)
5. [BreezeJS](http://breezejs.com) (optional)

# Optional

The application uses native AngularJS $http by default to make calls back to the server. However, by going to **app/customersApp/services/config.js** you can switch from using $http to using [BreezeJS](http://breezejs.com) (a very cool client-side data management library). When using BreezeJS you’ll also want to include [Breeze Angular Service](http://www.breezejs.com/documentation/breeze-angular-service)  (the script is already loaded in **index.html** to keep things simple). For more details on what BreezeJS is all about check out [my previous post](http://weblogs.asp.net/dwahlin/archive/2013/03/27/getting-started-managing-client-side-data-with-the-breeze-javascript-library.aspx).

1. [BreezeJS](http://www.breezejs.com/) 
2. [Breeze Angular Service](http://www.breezejs.com/documentation/breeze-angular-service)

# Application Views

  
The application has several views designed to cover different aspects of AngularJS from editing data to displaying, paging, and filtering data. Here are the main views:

## Customers View

This view provides multiple views of customer data (Card View and List View), supports paging, allows customers to be added or removed, and provides filtering functionality.

### **Card View** (app/customersApp/views/customers/customers.html)

This view displays customer information and allows customers to be edited (by clicking their name), deleted (by clicking the X), or their orders to be viewed.

  
[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_14.png)

### **List View** (app/customersApp/views/customers/customers.html)

  
This view displays customer information in a standard list type of view.

  
 [](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_16.png)

## **Login View** (app/customersApp/views/login.html)

  
This view allows the user to login. Security isn’t officially checked on the server for this demo as it just returns a boolean **true** value but the client-side does have security functionality built-in to show how that could be integrated with AngularJS, how events can be broadcast and handled, and more. Keep in mind that in a “real” application every secured resource on the server would have to be checked for the proper security credentials regardless of what data or information the client has.

  
[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_18.png)

  
 

## **Customer Edit View** (app/customersApp/views/customers/customerEdit.html)

  
This view adds some custom AngularJS validation including a custom directive (wcUnique.js) that ensures that the email address being added is unique.

  
[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_20.png)  
  
  

## **Customer Orders View** (app/customersApp/views/customers/customerOrders.html)

  
This view shows the orders for a specific customer. Orders can be sorted by clicking on the column headings.

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_22.png)

  

## **Orders View** (app/customersApp/views/orders/orders.html)

This view shows orders for all customers and supports paging, filtering, and sorting of the orders.

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_24.png)  
  

  

## **About View** (app/customersApp/views/about.html)

  
There isn’t much to this view but I listed it for the sake of completeness.

  
[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_26.png)

# Custom Directives

  
Three custom directives are currently included in the application:

1. Unique value directive (**app/customersApp/directives/wcUnique.js**) – This directive ensures that email addresses entered on the customer edit view are unique. It makes a call back to a service and then calls ngModel.$setValidity() to handle showing or hiding an error message. A post on this directive [can be read here](http://weblogs.asp.net/dwahlin/archive/2013/09/24/building-a-custom-angularjs-unique-value-directive.aspx).
    
    > [](https://mscblogs.blob.core.windows.net/media/dwahlin/Media/image_612DB8F0.png)
    
2. Angular Overlay directive (**app/wc.directives/directives/wcOverlay.js**) – This directive intercepts XmlHttpRequest calls and displays a custom overlay (tracks AngularJS calls as well as jQuery). The directive is available in the application or as a [stand-alone directive on Github](https://github.com/DanWahlin/AngularOverlay).
    
    > ![AngularOverlay Directive Example](/images/blog/learning-angularjs-by-example-the-customer-manager-application/appExample.png)
    
3. Menu highlighter directive (**app/wc.directives/menuHighlighter.js**). This directive is responsible for highlighting menu items as a user clicks on them.  
      
      
    [](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_28.png)

#   
Custom Filters

  
The application includes two custom filters used to filter data in the customers and orders views:

1. Name/City/State Filter (app/customersApp/filters/nameCityStateFilter.js)
    
    > [](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/Learning-AngularJS-by-Example--The-Custo_9F6C/image_30.png)
    
2. Name/Product Filter (app/customersApp/filters/nameProductFilter.js)  
      
      

# Conclusion

I’ll be enhancing the application even more over time and welcome contributions as well. Tony Quinn contributed the initial Node.js/MongoDB code (thanks Tony!) which is very cool to have as a back-end option and several other contributions have been made for testing and the initial version of the menuHighlighter directive. Access the [standard application here](https://github.com/DanWahlin/CustomerManagerStandard) and a version that has [custom routing in it here](https://github.com/DanWahlin/CustomerManager). Additional information about the custom routing can be found [in this post](http://weblogs.asp.net/dwahlin/archive/2013/05/22/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs.aspx).

**Onsite Developer Training:** If your company is interested in onsite training on JavaScript, ES6, AngularJS, Node.js, C# or other technologies please email [training@thewahlingroup.com](mailto:training@thewahlingroup.com) for details about the classes that we offer.
