---
title: "Data-Oriented vs. Control-Oriented Programming"
date: 2019-04-24
categories: 
  - "javascript"
  - "typescript"
tags: 
  - "data-binding"
  - "spas"
coverImage: "framework.webp"
---

![](/images/blog/data-oriented-vs-control-oriented-programming/framework-1024x682.webp)

I recently had someone ask me a question on Twitter about moving to Single Page Application frameworks and why they'd do that over choosing vanilla JavaScript or jQuery. It's a great question but tough to question on Twitter with the limited amount of characters. So, I thought I'd dust off an old post I wrote many years ago to address the subject. I also wrote a post titled [Choosing the "Right" JavaScript Library/Framework for Your Application](https://blog.codewithdan.com/choosing-the-right-javascript-library-framework-for-your-application/) that has some additional ideas to consider as well.

Any type of front-end app can be built using vanilla JavaScript, jQuery, or a Single Page Application (SPA) framework or library. Let's face it - the end user really doesn't care what option we choose as developers. When is the last time one of your end users asked, "Hey Michelle - what type of coding platform did you use for that app? Tell me more about the application architecture too!".

Control-oriented versus data-oriented programming really comes down to how much you want to focus on custom coding versus solving business issues in a given application. With the vanilla JavaScript approach you have "raw" access to the DOM, but you also have to write everything yourself including things like routing, data binding, HTTP calls to the server, and more. With jQuery you get a simplified way to access the DOM, handle events, make HTTP calls, etc. but you still have to write a lot of custom code to handle other scenarios and get data in and out of screens. If you want data binding support (more on this in a moment) you can choose one of many libraries out there. One example of a data binding library is [KnockoutJS](https://knockoutjs.com/). Its been around for quite awhile, but it can significantly reduce the amount of code you write to get data in and out of your screens. Finally, there are Single Page Application (SPA) libraries and frameworks that provide a lot of functionality out of the box especially when it comes to working with data.

I prefer to go with a well established and well supported SPA library/framework whether it's Angular, React, Vue.js or something else. Having written many front-end applications over the years I've come to realize that taking the time to write (and support) custom code to do what many SPA libraries/framework do out of the box isn't worth my time and effort. That's a very subjective opinion of course, but I'm confident that a lot of front-end developers out there agree with that sentiment. Plus, I can't possibly keep up with all of the different security challenges that come up and ensure that a custom framework/library I write from scratch accounts for any new hacks.

For me it really boils down to if you want to write all of the code to interact with controls on your screen or if you want to allow data to change what displays on the screen. I call it "Data-Oriented vs. Control-Oriented Programming".

## Control-Oriented Programming

Data binding is a key aspect of client-centric programming that can significantly minimize the amount of code written, simplify maintenance, and ultimately reduce the number of bugs that crop up in an application. Without data binding you have to locate each control in a page with code and then assign or extract a value to/from it – something I call “control-oriented” programming. Here’s a more nasty example of control-oriented programming (a lot of potential refactoring could be applied with this old code, but notice how many controls are accessed):

```
function loadApprovalDiv()
{
    var subTotal = parseFloat($('#SubTotal').text());
    $('#ClientSubTotal').val(subTotal.toFixed(2));
    var salesTaxRate = parseFloat($('#SalesTaxRate').val()) / 100;
    var salesTaxAmount = (subTotal * salesTaxRate) * .9;
    var deliveryFee = parseFloat($('#DeliveryFee').val());
    var adminFee = ((subTotal + salesTaxAmount + deliveryFee) * .05);
    var total = (Round(subTotal) + Round(salesTaxAmount) +  
      Round(deliveryFee) + Round(adminFee));
    $('#ClientTotal').val(total);
    var deliveryAddress = $('#Delivery_Street').val();
    //See if they entered a suite
    if ($('#Delivery_Suite').val() != '') {
      deliveryAddress += ', Suite ' + $('#Delivery_Suite').val();
    }
    deliveryAddress += ' ' + $('#Delivery_City').val() + ' ' + 
       $('#Delivery_StateID option:selected').text() + ' ' +
       $('#Delivery_Zip').val();
   
    var data = {
      finalSubTotal  : subTotal.toFixed(2),
      finalSalesTax  : salesTaxAmount.toFixed(2),
      finalTotal     : total.toFixed(2),
      deliveryFee    : deliveryFee.toFixed(2),
      adminFee       : adminFee.toFixed(2),
      deliveryName   : $('#Delivery_Name').val(),
      deliveryAddress: deliveryAddress,
      deliveryDate   : $('#Delivery_DeliveryDate').val(),
      deliveryTime   : $('#Delivery_DeliveryTime option:selected')
                         .text(),
      mainItems      : generateJson('Main'),
      accessoryItems : generateJson('Accessory')
    };
    $('#OrderSummaryOutput').html(
      $('#OrderSummaryTemplate').render(data)
    );
}
```

Looking through the code you can see that a lot of it is dedicated to finding controls in the page and extracting their values. This works absolutely fine – after all, many applications take this approach. However, when an application is focused on controls and not on data a lot of extra code and plumbing ends up being written which complicates things if control IDs are changed, new controls are added, or existing controls are removed. If you only have a few controls that’s not a big deal, but as the number of controls grows it becomes problematic. [The cheese](https://en.wikipedia.org/wiki/Who_Moved_My_Cheese%3F) has definitely moved when it comes to client-side programming and the smart money is on building data-oriented applications rather than control-oriented applications like the one above.

## Data-Oriented Programming

I refer to applications that use data binding as being “data-oriented” since they’re focused on the actual data as opposed to writing code to access controls in a given page (“control-oriented” as mentioned earlier). I’ve built a lot of control-oriented applications over the years and found that making the transition to building data-oriented applications definitely requires a different thought process. However, making the move to building data-oriented applications is well worth the effort and ultimately results in better applications in my experience. I think it’s especially important for front-end applications built using JavaScript.

If you're already using a SPA framework/library or data binding library then I'm "preaching to the choir" since you already get the value of data-oriented programming. However, if you're new to this front-end world then data-oriented programming is something I'd highly recommend you consider and look into more.

Here are a few (very simple) examples of what I mean if you're new to the concept:

#### Knockout.js

```
<input data-bind="value: customer.firstName" />
```

#### **Angular:**

```
<input [(ngModel)]="customer.firstName" />
```

#### React:

```
<input type="text" value={this.state.customer.firstName} 
  onChange={this.handleChange} />
```

#### Vue.js

```
<input v-model="customer.firstName" />
```

These different code examples will automatically handle updating the target property (**firstName** in this case) as the textbox changes. Notice how no **id** is required at all on each input and NO CODE exists to go find the input. Now imagine a form that has many textboxes, textareas, radiobuttons, checkboxes, etc. and you can see how the data-oriented approach leads to much cleaner code. Plus, you can use this same approach to let your data drive showing and hiding parts of a screen, handle events, and perform many other productive tasks. Simply flip a boolean property from false to true, and with the right data bindings in place magic just happens.

By using a data-oriented library/framework you can wire JavaScript object properties to controls and have the controls and object properties update automatically (a process referred to as “two-way” binding) as changes are made on either side. This means that you don’t have to write selectors to find controls in the DOM and update them or grab values as mentioned earlier. If you’ve ever worked with desktop development frameworks then you’re more than likely used to this type of functionality and I’m willing to bet that you can’t live without it. Data binding is addictive once you start using it.

Although I’ve been a big fan of jQuery and vanilla JavaScript over the years, as I wrote more and more front-end applications I realized that a lot of unnecessary code was being written that could be eliminated by using a data-oriented approach. jQuery and vanilla JavaScript still have their place in some applications (not every application has robust data binding needs after all), but using those options to build data-oriented applications isn’t a good use of their functionality in my opinion - and not a good use of your time either. Those options are great when you require low-level DOM access but not as great when an application has a lot of Create, Read, Update, Delete (CRUD) operations going on, a lot of user interaction, and more. When you understand what a data-oriented application really is and why it’s important, then using that technique makes more sense for CRUD applications as well as many other application types.

## Conclusion

With SPA frameworks/libraries like Angular/React/Vue.js and others the data binding engine is built-in so going with a data-oriented approach is fairly straightforward. The challenge in the JavaScript world is that there isn’t simply one “best” data binding option to choose. Many different script libraries/frameworks continue to appear on the scene with their own set of pros and cons. The next challenge is [choosing the framework/library](https://blog.codewithdan.com/choosing-the-right-javascript-library-framework-for-your-application/) that works best for you - just make sure it has data-oriented programming support built-in!
