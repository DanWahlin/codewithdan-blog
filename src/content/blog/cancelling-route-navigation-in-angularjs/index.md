---
title: "Cancelling Route Navigation in AngularJS"
date: 2014-10-19
categories: 
  - "angularjs"
  - "javascript"
  - "spa"
---

![](/images/blog/cancelling-route-navigation-in-angularjs/AngularJS_thumb_1008B166.jpg)

<script type="text/javascript">// <![CDATA[ document.write(getHtmlFragment('angularjsGetStarted')); // ]]></script>

**This post has been updated to cover AngularJS 1.3+.  
**

Routing provides a nice way to associate views with controllers in AngularJS using a minimal amount of code. While a user is normally able to navigate directly to a specific route, there may be times when a user triggers a route change before they’ve finalized an important action such as saving data.  In this type of situation you may want to cancel the route navigation and ask the user if they’d like to finish what they were doing so that their data isn’t lost. In another situation the user may try to navigate to a view that requires some type of login or other special handling. If the user hasn’t logged in yet the app can automatically redirect them to a login screen (keep in mind that for security the server always has to double-check things since JavaScript can easily be changed).

When route navigation occurs in an AngularJS application a few key events are raised. One is named **$locationChangeStart** and the other is **$routeChangeStart**. Starting with AngularJS 1.3+ this is the order that events fire (see [this commit](https://github.com/angular/angular.js/commit/f4ff11b01e6a5f9a9eb25a38d327dfaadbd7c80c) by [Tobias Bosch](https://github.com/tbosch) for more details):

  
**$locationChangeStart - - $routeChangeStart - - $locationChangeSuccess - - $routeChangeSuccess**

Both events allow route navigation to be cancelled starting with AngularJS 1.3+ by calling **preventDefault()** on the **event** object.  Let’s take a look at the **$locationChangeStart** event first and see how it can be used to cancel route navigation when needed.

## The $locationChangeStart Event

  
If you dig into the AngularJS core script you’ll find the following code that shows how the **$locationChangeStart** event is raised as the **$browser** object’s **onUrlChange()** function is invoked:

```
$browser.onUrlChange(function(newUrl, newState) {
    $rootScope.$evalAsync(function() {
        var oldUrl = $location.absUrl();
        var oldState = $location.$$state;

        $location.$$parse(newUrl);
        $location.$$state = newState;
        if ($rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
            newState, oldState).defaultPrevented) {
            $location.$$parse(oldUrl);
            $location.$$state = oldState;
            setBrowserUrlWithFallback(oldUrl, false, oldState);
        } else {
            initializing = false;
            afterLocationChange(oldUrl, oldState);
        }
    });
    if (!$rootScope.$$phase) $rootScope.$digest();
});
```

  
  
The key part of the code is the call to **$broadcast**. This call broadcasts the **$locationChangeStart** event to all child scopes so that they can be notified before a location change is made. To handle the **$locationChangeStart** event you can use the **$scope.$on()** function (in a controller for example) or you can use **$rootScope.$on()** (in a factory or service for example). For this example I’ve added a call to **$on()** into a function that is called immediately after the controller is invoked to watch for location changes:

```
function init() {
    
    //initialize data here..    

    //Make sure they're warned if they made a change but didn't save it
    //Call to $on returns a "deregistration" function that can be called to
    //remove the listener (see routeChange() for an example of using it)
    onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
}

function routeChange(event, newUrl) {
   ...
}
```

  
This code listens for the **$locationChangeStart** event and calls **routeChange()** when it occurs. The value returned from calling **$on** is a “deregistration” function that can be called to detach from the event. In this case the deregistration function is named **onRouteChangeOff** (it’s accessible throughout the controller in this example). You’ll see how the **onRouteChangeOff** function is used in just a moment.

## Cancelling Route Navigation with $locationChangeStart

The **routeChange()** callback triggered by the **$locationChangeStart** event displays a modal dialog similar to the following to prompt the user:

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/7dac51414bc7_13775/image_4.png)

Here’s the code for **routeChange()**:

```
function routeChange(event, newUrl, oldUrl) {
    //Navigate to newUrl if the form isn't dirty
    if (!$scope.editForm || !$scope.editForm.$dirty) return;

    var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ignore Changes',
        headerText: 'Unsaved Changes',
        bodyText: 'You have unsaved changes. Leave the page?'
    };

    modalService.showModal({}, modalOptions).then(function (result) {
        if (result === 'ok') {
            onRouteChangeOff(); //Stop listening for location changes
            $location.path($location.url(newUrl).hash()); //Go to page they're interested in
        }
    });

    //prevent navigation by default since we'll handle it
    //once the user selects a dialog option
    event.preventDefault();
    return;
}
```

Looking at the parameters of **routeChange()** you can see that it accepts an **event** object and the new route that the user is trying to navigate to. The **event** object is used to prevent navigation since we need to prompt the user before leaving the current view. In this example we’re checking if the form is dirty (changes have been made) and if the user hasn’t saved the changes yet. In cases where the form is dirty the user can be notified and given a change to stay on the current view.

As the code in **routeChange()** executes a modal dialog is shown by calling **modalService.showModal()** (see my [previous post](http://weblogs.asp.net/dwahlin/archive/2013/09/18/building-an-angularjs-modal-service.aspx) for more information about the custom **modalService** that acts as a wrapper around Angular UI Bootstrap’s $modal service). From there the route navigation is cancelled at the end of the function (event.preventDefault()) since the user needs to choose if they want to stay on the view and finish their edits or leave the view and navigate to a different location.

If the user selects “Ignore Changes” then their changes will be discarded and the application will navigate to the route they intended to go to originally. This is done by first detaching from the **$locationChangeStart** event by calling **onRouteChangeOff()** (recall that this is the function returned from the call to **$on()**) so that we don’t get stuck in a never ending cycle where the dialog continues to display when they click the “Ignore Changes” button. A call is then made to **$location.path($location.url(newUrl).hash())** to handle navigating to the target view. If the user cancels the operation they’ll stay on the current view.

## The $routeChangeStart Event

The **$locationChangeStart** event isn’t the only game in town with AngularJS. Within **angular-route.js** you’ll find the following function that raises a **$routeChangeStart** event as a route is about to be changed:  
  
  

```
function prepareRoute($locationEvent) {
    var lastRoute = $route.current;

    preparedRoute = parseRoute();
    preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
        && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
        && !preparedRoute.reloadOnSearch && !forceReload;

    if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
            if ($locationEvent) {
                $locationEvent.preventDefault();
            }
        }
    }
}
```

  
  
Looking through the code you’ll see that a call is made to **$rootScope.$broadcast** to raise the **$routeChangeStart** event.

How does this event fit in with **$locationChangeStart** since they sound quite similar? When **$locationChangeStart** fires you get access to the new URL the user is trying to go to as well as the old URL as strings. When **$routeChangeStart** fires you can get access to the raw route definition defined using **$routeProvider** (more on this in a moment). This can be useful if you want to cancel a route based upon data provided in the route definition.

For example, let’s say that before a user navigates to certain routes they need to be redirected to a login page if one of our AngularJS factories determines that they haven’t logged in yet. Keep in mind that there’s no such thing as client-side security in this scenario and the redirect could always be hacked (quite easily) using browser developer tools. As a result your server-side code should always double-check security for secured pages/views, data, and more. But, a factory can certainly track if a user has logged in or not and then redirect them. If someone hacks the script the server would detect it assuming things are setup correctly. Let’s take a closer look at the **$routeChangeStart** event and how it can be used to cancel route navigation or redirect a user to another route.

## Cancelling Route Navigation with $routeChangeStart

  
How do you determine whether or not a route has to be handled in a special way as a user tries to navigate to it? Although AngularJS doesn’t have anything built-in, you can always add your own properties onto routes defined in an app. For example, here’s an example of a route that includes a custom property named **secure**:

```
$routeProvider.when('/customeredit/:customerId', {
    controller: 'CustomerEditController',
    templateUrl: viewBase + 'customers/customerEdit.html',
    secure: true //This route requires an authenticated user
});
```

This code specifies that the route requires extra handling and requires the user to be logged in before navigating to it. In addition to marking a route as “secure”, you could also define additional information such as allowed roles or any other special requirements (keeping in mind that the server always has to double-check security and that you would never want to push anything super sensitive security-wise down to the client). As a route is about to change you can listen for the **$routeChangeStart** event and use the event parameters to get access to the route definition - including any custom properties. Here’s an example of hooking up to the event using **$rootScope.$on()** in Angular’s **run()** function:  
  

```
app.run(['$rootScope', '$location', 'authService',
    function ($rootScope, $location, authService) {
            
        //Client-side security. Server-side framework MUST add it's 
        //own security as well since client-based “security” is easily hacked
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
          //Look at the next parameter value to determine if a redirect is needed        
        });

}]);
```

When **$routeChangeStart** fires you get access to the event object, the next route, and the current route. It’s quite similar to **$locationChangeStart** although the parameter data is very different and provides a lot more information. In the case of **$routeChangeStart** the **next** parameter shown in the previous code will give you access to the following:

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/7dac51414bc7_13775/image_2.png)

Notice that by going through the **$$route** property you can get to the raw route definition data including the custom **secure** property. While going through any property that starts with **$$** is generally frowned upon due to the “private” nature of these properties (they could change in future versions), there isn’t a viable alternative at the present time when you need to get to the route data as the **$routeChangeStart** event is fired. I hope that will change in the future and that route data will be made more publicly accessible.

If you don’t like that option you could always have a factory or service (such as **authService** in the code above) store information about special routes and then evaluate the **newUrl** parameter passed by the **$locationChangeStart** event to determine if a given route needs to be cancelled or redirected. That would involve some string comparisons but could certainly get the job done.

As **$routeChangeStart** fires you can use the following code to trigger a redirect to another view if needed. Notice that the **secure** property shown earlier is checked and used to determine if the path needs to change:

```
if (next && next.$$route && next.$$route.secure) { 
    if (!authService.user.isAuthenticated) { 
        $rootScope.$evalAsync(function () { 
            $location.path('/login'); 
        }); 
    } 
} 
```

Notice that the call to **$location.path()** is wrapped in the **$evalAsync()** method so that the location changes properly and everything stays in sync. If you don’t include that little bit of code things won’t work properly.  If you want to completely cancel route navigation you can also call **event.preventDefault()** as shown earlier with the **$locationChangeStart** event code. That’s a new feature that’s now available in AngularJS 1.3+.

## Conclusion  
  

The key to canceling routes is understanding how to work with the **$locationChangeStart** and **$routeChangeStart** events and cancelling or redirecting as needed . You can see this code in action in the [Customer Manager application](https://github.com/DanWahlin/CustomerManagerStandard) available on Github (specifically [customerEditController.js](https://github.com/DanWahlin/CustomerManagerStandard/blob/master/CustomerManager%2Fapp%2FcustomersApp%2Fcontrollers%2Fcustomers%2FcustomerEditController.js) and [app.js](https://github.com/DanWahlin/CustomerManagerStandard/blob/master/CustomerManager%2Fapp%2FcustomersApp%2Fapp.js)). Learn more about the [application here](https://weblogs.asp.net/dwahlin/learning-angularjs-by-example-the-customer-manager-application).
