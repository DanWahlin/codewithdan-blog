---
title: "Adding Azure Active Directory and OWIN Code into an AngularJS/ASP.NET MVC Application to Handle User Authentication"
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

In a [previous post](http://www.itunity.com/article/integrating-aad-services-angularjs-office-365-part-3-770) I discussed how to setup the necessary configuration code and assemblies in an AngularJS/ASP.NET MVC application in order to authenticate users against [Azure Active Directory](http://azure.microsoft.com/en-us/services/active-directory/) (AAD). Once the initial configuration is complete you can write code to redirect users to the AAD login screen to retrieve an ID token.

In Part 4 of an article series I’m writing for [http://itunity.com](http://itunity.com) I discuss the necessary code that’s required to authenticate a user and retrieve the ID token. Additional topics covered include hooking AAD into the ASP.NET MVC pipeline, creating an Entity Framework token cache, triggering authentication against AAD in MVC controllers, and more. Here’s an excerpt from the article. The complete code for the application discussed in the article series can be found on the [OfficeDev Github site](https://github.com/OfficeDev/SP-AngularJS-ExpenseManager-Code-Sample).  

## Adding AAD Configuration and Assemblies into an Application

[Part 3](http://www.itunity.com/article/integrating-aad-services-angularjs-office-365-part-3-770) of this series covered how to access the Client ID, Key, and Tenant ID values from Azure Active Directory (AAD) and add them into web.config. It also showed how to get the necessary AAD and OWIN NuGet packages in place and create a _SettingsHelper_ class to simplify the process of accessing web.config values.

In this article, you’ll see how the values defined in web.config can be used to associate a custom application with AAD. Topics covered include setting up a token storage cache, hooking AAD code into the OWIN startup process, and creating an ASP.NET MVC controller to display a login page to end users and handle directing them to the application upon successful authentication. All of the code that follows is from the [Expense Manager application](https://github.com/OfficeDev/SP-AngularJS-ExpenseManager-Code-Sample) that’s available on the OfficeDev GitHub site.

Let’s kick things off by looking at AAD token storage and the role it plays in applications.  

### AAD Token Storage

The NuGet packages added into the application (see [Part 3](http://www.itunity.com/article/integrating-aad-services-angularjs-office-365-part-3-770) of this series) provide the necessary functionality to authenticate a user with AAD. Once authenticated, AAD will return an ID token that can be stored by the application and used as secured resources such as Web API, Office 365 APIs, or other resources are accessed. The AAD documentation provides a diagram that sums up the overall authentication workflow well:  

[](http://www.itunity.com/content/content/771/wahlin_fig1.png)

  
Figure 1. The flow as a user logs into AAD, gets an ID token, and then accesses an application and additional resources. This image is from [http://msdn.microsoft.com/en-us/library/azure/dn499820.aspx](http://msdn.microsoft.com/en-us/library/azure/dn499820.aspx).

While the token received by the application can be stored in memory during development, it’s recommended that a more robust token store be put in place to handle that task for production. You can find several sample applications that integrate with AAD and handle tokens on the [Azure Active Directory Github samples site](https://github.com/AzureADSamples). Some of the samples use an in-memory store while others rely on a database, which is recommended when an app is ready to move to production.

In this part of the article, you’ll see the steps required to get an Entity Framework and SQL Server token store in place. If you don’t already have the Entity Framework NuGet package installed in your project you’ll need to install it.

From a high level, the following tasks will be discussed:

1. Create a model class named _PerWebUserCache_ that’s used to define properties that are needed to store and retrieve AAD tokens.
2. Create an Entity Framework DbContext class named _EFADALContext_ that interacts with a SQL Server database.
3. Create a token cache class named _EFADALTokenCache_ that uses the context class to store and retrieve tokens from a SQL Server database.
4. Add startup code that uses the previous classes and is responsible for handling authentication as a user requests a secure resource.

To get started, add a new class named _PerWebUserCache.cs_ into the _Models_ folder of an ASP.NET MVC application. This code defines properties that will be used by the token store. Add the following code into the class:

```
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ExpenseManager.Models
{
   public class PerWebUserCache
   {
       [Key]
       public int EntryId { get; set; }
       public string webUserUniqueId { get; set; }
       public byte[] cacheBits { get; set; }
       public DateTime LastWrite { get; set; }
   }
}
```

  
Listing 1. The PerWebUserCache model class defines properties that will be used by the token store.  

Now add a class named _EFADALContext.cs_ into the _Utils_ folder. This class will derive from Entity Framework’s _DbContext_ class and handle mapping the _PerWebUserCache_ object to the proper table in SQL Server. Add the following code into the _EFADALContext_ class:

```
using ExpenseManager.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace ExpenseManager.Utils
{
   public class EFADALContext : DbContext
   {
       public EFADALContext() : base("EFADALContext")
       {
       }
       public DbSet<PerWebUserCache> PerUserCacheList { get; set; }
       protected override void OnModelCreating(DbModelBuilder modelBuilder)
       {
           modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
       }
   }
}
```

  
Listing 2. The EFADALContext class handles table creation and queries with SQL Server.  

Now that the model and database context classes have been created, a token cache class named _EFADALTokenCache_ can be created that uses the context to store and retrieve AAD tokens. This is one of many [classes](https://github.com/AzureADSamples/WebApp-WebAPI-MultiTenant-OpenIdConnect-DotNet/blob/master/TodoListWebApp%2FDAL%2FEFADALTokenCache.cs) provided by the AAD samples site on GitHub that was mentioned earlier.

Add a class named _EFADALTokenCache.c_s into the _Utils_ folder that has the following code in it:

```
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using ExpenseManager.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ExpenseManager.Utils
{
   public class EFADALTokenCache : TokenCache
   {
       private EFADALContext _Context = new EFADALContext();
       string User;
       PerWebUserCache Cache;

       // constructor
       public EFADALTokenCache(string user)
       {
           // associate the cache to the current user of the web app
           User = user;
           this.AfterAccess = AfterAccessNotification;
           this.BeforeAccess = BeforeAccessNotification;
           this.BeforeWrite = BeforeWriteNotification;

           // look up the entry in the DB
           Cache = _Context.PerUserCacheList.FirstOrDefault(c => 
                    c.webUserUniqueId == User);
           // place the entry in memory
           this.Deserialize((Cache == null) ? null : Cache.cacheBits);
       }

       // clean up the DB
       public override void Clear()
       {
           base.Clear();
           foreach (var cacheEntry in _Context.PerUserCacheList)
               _Context.PerUserCacheList.Remove(cacheEntry);
           _Context.SaveChanges();
       }

       // Notification raised before ADAL accesses the cache.
       // This is your chance to update the in-memory copy from the DB
       // if the in-memory version is stale.
       void BeforeAccessNotification(TokenCacheNotificationArgs args)
       {
           if (Cache == null)
           {
               // first time access
               Cache = _Context.PerUserCacheList.FirstOrDefault(c => 
                        c.webUserUniqueId == User);
           }
           else
           {   // retrieve last write from the DB
               var status = from e in _Context.PerUserCacheList
                            where (e.webUserUniqueId == User)
                            select new
                            {
                                LastWrite = e.LastWrite
                            };
               // if the in-memory copy is older than the persistent copy
               if (status.First().LastWrite > Cache.LastWrite)

               // read from from storage, update in-memory copy
               {
                   Cache = _Context.PerUserCacheList.FirstOrDefault(
                            c => c.webUserUniqueId == User);
               }
           }
           this.Deserialize((Cache == null) ? null : Cache.cacheBits);
       }

       // Notification raised after ADAL accessed the cache.
       // If the HasStateChanged flag is set, ADAL changed the content of the cache
       void AfterAccessNotification(TokenCacheNotificationArgs args)
       {
           // if state changed
           if (this.HasStateChanged)
           {
               Cache = new PerWebUserCache
               {
                   webUserUniqueId = User,
                   cacheBits = this.Serialize(),
                   LastWrite = DateTime.Now
               };

               // update the DB and the lastwrite                
               _Context.Entry(Cache).State = Cache.EntryId == 0 ? 
                  EntityState.Added : EntityState.Modified;
               _Context.SaveChanges();
               this.HasStateChanged = false;
           }
       }
       void BeforeWriteNotification(TokenCacheNotificationArgs args)
       {
           // if you want to ensure that no concurrent write takes place, 
           // use this notification to place a lock on the entry
       }
   }
}
```

  

Listing 3. The EFADALTokenCache class is responsible for storing and retrieving AAD tokens used by the application.  

This code handles managing an in-memory store that is backed by a database. As changes are made or the local cache becomes stale, calls are made to update the proper fields in the database. With the EFADALTokenCache class in place along with the model and database context classes, it’s now time to add AAD code in the application to allow users to be authenticated. This code will tie AAD into OWIN so that any secured application resources trigger the authentication process.

Read the full article at [http://www.itunity.com/article/integrating-angularjs-azure-active-directory-services-office-365sharepoint-part-4-771](http://www.itunity.com/article/integrating-angularjs-azure-active-directory-services-office-365sharepoint-part-4-771 "http://www.itunity.com/article/integrating-angularjs-azure-active-directory-services-office-365sharepoint-part-4-771").
