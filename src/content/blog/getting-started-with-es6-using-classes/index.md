---
title: "Getting Started with ES6 - Using Classes"
date: 2015-08-05
categories: 
  - "es6"
  - "javascript"
coverImage: "es6-logo-300x300-e1459634632847.png"
---

In a [previous post](http://weblogs.asp.net/dwahlin/getting-started-with-es6-–-transpiling-es6-to-es5) I introduced how ES6 can be transpiled to ES5 using Traceur or Babel. By using transpilers you can write“modern” code and leverage features found in ES6 today while still allowing the code to run in older browsers. In this post I’m going to dive into classes which is one of the shiny new features found in ES6.

# Getting Started with ES6/ES2015 Classes

Classes are the subject of much debate in the JavaScript world with some people loving them and others hating them. I’ve never believed in one world view being right for every situation and think that classes definitely have their place. If nothing else they’re worth exploring so that you understand the different options provided by ES6. If you want to continue with the more traditional “functional programming” techniques available in JavaScript it’s important to note that you can still do that. Classes are an option provided by ES6 but certainly not required to write ES6 code.

Here’s an example of an ES6 class that defines an automobile:

```
class Auto {
    constructor(data) {
        this.make = data.make;
        this.model = data.model;
        this.year = data.year;
        this.price = data.price;
    }

    getTotal(taxRate) {
        return this.price + (this.price * taxRate);
    }

    getDetails() {
        return `${this.year} ${this.make} ${this.model}`;
    }
}
```

If you’ve worked with languages such as Java, C# or others that support classes the general syntax will probably look familiar. You can see that the **class** keyword is used to define a container named **Auto**. The class contains a **constructor** that is called when the class is created using the **new** keyword (more on “new” later). The constructor provides a place where you can initialize properties with values. In the **Auto** class example above a **data** object is passed into the constructor and its properties are associated with the **make**, **model**, **year** and **price** properties.

The **Auto** class also defines two functions named **getTotal()** and **getDetails()** as well. You’ll quickly notice that the **function** keyword isn’t used to define each function. That’s a new feature available in classes (and in others parts of ES6 such as functions in object literals) that provides a nice, compact way to define functions. Within the **getDetails()** function you’ll also notice another new feature in ES6 – template strings. I’ll provide additional details about this feature in a future post.

The class code shown above is referred to as a “class definition”. Classes can also be defined using a “class expression” syntax as well. An example of a class expression is show next:

```
let Automobile = class {
    constructor(data) {
        this.make = data.make;
        this.model = data.model;
        this.year = data.year;
        this.price = data.price;
    }

    getDetails() {
        return `${this.year} ${this.make} ${this.model}`;
    }
}
```

The **Automobile** variable in this example is assigned to a class expression that has a constructor and a **getDetails()** function. The **let** keyword used in this example creates a local scoped variable. If you put this code inside a block such as an **if** statement or **for** loop the variable’s scope will be limited to the block. That’s another new (and very welcome) feature provided by ES6.

ES6 classes can also contain property get and set blocks if desired. This is done by using  the **get** and **set** keywords:

```
class AutoWithProperties {
    constructor(data) {
        this._make;
        this._model;
    }

    get make() {
        return this._make;
    }
    
    set make(val) {
        if (val) {
            this._make = val;
        } else {
            this._make = 'No Make';
        }
    }
    
    get model() {
        return this._model;
    }
    
    set model(val) {
        if (val) {
            this._model = val;
        } else {
            this._model = 'No Model';
        }
        
    }
}
```

The **AutoWithProperties** class defines two properties named **make** and **model** that read (the get block) and write (the set block) to and from backing properties named \_**make** and \_**model**.

# Creating an Instance of a Class

Once a class is defined you can create an instance using the **new** keyword. For example, an instance of **Auto** can be created using the following code:

```
let auto = new Auto({
   make: 'Chevy',
   model: 'Malibu',
   price: 30000, 
   year: 2014
});
```

What happens if you try to call the **Auto** class as a function without using the **new** keyword? That’s one of the limitations of classes in ES6 and something the anti-class crowd will quickly point out as a flaw. Calling a class as a regular function results in the following error:

[](https://mscblogs.blob.core.windows.net/media/dwahlin/Windows-Live-Writer/bbaa0c1a4e61_8A2E/classError_2.png)

This limitation is problematic when using a “functional programming” approach and definitely something to consider before choosing to use classes.

Classes also aren’t hoisted like regular JavaScript functions. If you try to “new up” a class before the class is defined the class definition won’t be hoisted to the top of the code to make that scenario work as with regular JavaScript functions. Instead, you’ll get an error saying that the class is not a function. That’s another limitation of classes that you should be aware of.

# Extending a Class

Extending a function in ES5 requires use of the prototype property. ES6 classes still rely on prototype under the covers, but the syntax is much easier to read and understand. To extend a class you can use the **extends** keyword as shown next:

```
class Car extends Auto {
    constructor(data) {
        super(data);
        this.isElectric = data.isElectric;
        this.isHatchback = data.isHatchback;
    }

    getDetails() {
        return `${super.getDetails()} Electric: ${this.isElectric} Hatchback: ${this.isHatchback}`;
    }
}
```

This example defines a new **Car** class that extends the **Auto** class. The class’s constructor forwards the **data** parameter to the base class by making a call to **super()**.

It’s important to note that a call to **super()** must be made before properties are initialized using “this” (if you return Object.create(null) from the constructor then you don’t actually have to call super() though).  Anytime you extend a class **super()** must be called even if no data is passed to the base class’s constructor. The only exception to this rule is if the base and derived classes do not explicitly define custom constructors. In that case constructors will be implicitly created for both of the classes.

Here's a fiddle with the Auto and Car code in it that you can play around with:

<iframe width="100%" height="300" src="//jsfiddle.net/dwahlin/o93Lm0rc/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

# Summary

Classes provide a succinct and clean way to encapsulate code that makes JavaScript feel more “object-oriented” even though prototypes are still used behind the scenes. They also provide constructors, support properties, allow functions to be defined without using the **function** keyword and support extension using the **extends** keyword. Developers coming from languages that support classes will feel right at home using the new class feature in ES6.

So should you move all of your code to classes as you migrate to ES6? Developers that prefer “functional programming” will be quick to say NO and avoid them like the plague. Classes don’t fit in well with the functional programming approach. If you understand their limitations (having to use new, no hoisting, etc.) then I think they can work well in some applications although it depends on the type of JavaScript code you like to write. I always say, “Use the right tool for the right job” which means taking the time to learn the ins-and-outs of classes and deciding if their pros outweigh their cons for your target application.

You can play around with classes by using the fiddle above, by using my ES6 starter project available at [https://github.com/DanWahlin/ES6-Modules-Starter](https://github.com/DanWahlin/ES6-Modules-Starter "https://github.com/DanWahlin/ES6-Modules-Starter") or by visiting the [Babel ES6 playground](https://babeljs.io/repl/#?experimental=true&evaluate=true&loose=false&spec=false&code=class%20Auto%20%7B%0A%20%20%0A%7D).
