---
title: "Extending Classes and Interfaces using TypeScript"
date: 2015-04-10
categories: 
  - "net"
  - "javascript"
  - "typescript"
---

![image](/images/blog/extending-classes-and-interfaces-using-typescript/image_thumb_17649611.webp)In a [previous post](http://weblogs.asp.net/dwahlin/archive/2012/10/31/getting-started-with-typescript-classes-static-types-and-interfaces.aspx) I discussed the fundamentals of the TypeScript language and how it can be used to build JavaScript applications. TypeScript is all about strongly-typed variables and function parameters, encapsulation of code, and catching issues upfront as opposed to after the fact to provide more maintainable code bases. One of the great features it offers is the ability to take advantage of inheritance without having to be an expert in JavaScript prototypes, constructors, and other language features (although I certainly recommend learning about those features regardless if you use TypeScript or not).

In this post I’ll discuss how classes and interfaces can be extended using TypeScript and the resulting JavaScript that’s generated. Let’s jump in!  
  
  

# Extending Classes and Interfaces  

Let’s assume that we have a TypeScript class named **Auto** that has the following code in it:  
  

```
class Auto {
    private _basePrice: number;
    engine: IEngine;
    state: string;
    make: string;
    model: string;
    year: number;
    accessoryList: string;

    constructor(options: IAutoOptions) {
        this.engine = options.engine;
        this.basePrice = options.basePrice;
        this.state = options.state;
        this.make = options.make;
        this.model = options.model;
        this.year = options.year;
    }

    calculateTotal() : number {
        var taxRate = TaxRateInfo.getTaxRate(this.state);
        return this.basePrice + (taxRate.rate * this.basePrice);
    }

    addAccessories(...accessories: Accessory[]) {
        this.accessoryList = '';
        for (var i = 0; i < accessories.length; i++) {
            var ac = accessories[i];
            this.accessoryList += ac.accessoryNumber + ' ' + ac.title + '<br />';
        }
    }

    getAccessoryList(): string {
        return this.accessoryList;
    }

    get basePrice(): number {
        return this._basePrice;
    }

    set basePrice(value: number) {
        if (value <= 0) throw 'price must be >= 0';
        this._basePrice = value;
    }
} 
```

  
  
Looking through the code you can see that the class has several members including fields, a constructor, functions (including a function that accepts a special type of … parameter referred to as a rest parameter), and the get and set blocks for a property named basePrice. Although unrelated to inheritance, it’s important to note that properties in TypeScript only work when setting the TypeScript compilation target to ECMAScript 5 using the --target switch (for example:  tsc.exe --target ES5 YourFile.ts).

The engine field in the Auto class accepts any type that implements a TypeScript interface named IEngine and the constructor accepts any object that implements an IAutoOptions interface. Both of these interfaces are shown next:  
  
  

```
interface IEngine {
    start(callback: (startStatus: boolean, engineType: string) => void) : void;
    stop(callback: (stopStatus: boolean, engineType: string) => void) : void;
}

interface IAutoOptions {
    engine: IEngine;
    basePrice: number;
    state: string;
    make: string;
    model: string;
    year: number;
}
```

  
The start() and stop() functions in the IEngine interface both accept a callback function. The callback function must accept two parameters of type boolean and string. An example of implementing the IEngine interface using TypeScript is shown next. A class that implements an interface must define all members of the interface unless the members are marked as optional using the ? operator.  
  
  

```
class Engine implements IEngine {
    constructor(public horsePower: number, public engineType: string) { }

    start(callback: (startStatus: boolean, engineType: string) => void) : void{
        window.setTimeout(() => {
            callback(true, this.engineType);
        }, 1000);
    }

    stop(callback: (stopStatus: boolean, engineType: string) => void) : void{
        window.setTimeout(() => {
            callback(true, this.engineType);
        }, 1000);
    }
}
```

  
It goes without saying that if we wanted to create a Truck class that extends the Auto class we wouldn’t want to cut-and-paste the code from Auto into Truck since that would lead to a maintenance headache down the road. Fortunately, TypeScript allows us to take advantage of inheritance to re-use the code in Auto. An example of a Truck class that extends the Auto class using the TypeScript **extends** keyword is shown next:  
  
  

```
class Truck extends Auto {
    private _bedLength: string;
    fourByFour: boolean;

    constructor(options: ITruckOptions) {
        super(options);
        this.bedLength = options.bedLength;
        this.fourByFour = options.fourByFour;
    }

    get bedLength(): string {
        return this._bedLength;
    }

    set bedLength(value: string) {
        if (value == null || value == undefined || value == '') {
            this._bedLength = 'Short';
        }
        else {
            this._bedLength = value;
        }
    }
}
```

  

The Truck class extends Auto by adding bedLength and fourByFour capabilities. The constructor also accepts an object that implements the ITruckOptions interface which in turn extends the IAutoOptions interface shown earlier. Notice that interfaces can also be extended in TypeScript by using the **extends** keyword:  

```
interface ITruckOptions extends IAutoOptions {
    bedLength: string;
    fourByFour: boolean;
}
```

  
Here’s an example of creating a new instance of the Truck class and passing an object that implements the ITruckOptions interface into its constructor:  
  
  

```
var truck = new Truck({
    engine: new Engine(250, 'V8'),
    basePrice: 45000,
    state: 'Arizona',
    make: 'Ford',
    model: 'F-150',
    year: 2013,
    bedLength: 'Short Bed',
    fourByFour: true
});
```

#   
  
Inheritance in JavaScript  

  
You can see that the TypeScript **extends** keyword provides a simple and convenient way to inherit functionality from a base class (or extend an interface) but what happens behind the scenes once the code is compiled into JavaScript? After all, JavaScript doesn’t have an **extends** or **inherits** keyword in the language - at least not in ECMAScript 5 or earlier. If you look at the JavaScript code that’s output by the TypeScript compiler you’ll see that a little magic is added to simulate inheritance in JavaScript using prototyping.

First, a variable named \_\_extends is added into the generated JavaScript and it is assigned to a function that accepts two parameters as shown next:  
  
  

```
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
```

  
  
The function accepts the derived/child type (the d parameter) and the base type (the b parameter).  Inside of the function an object named \_\_ is created (definitely a strange name) and the derived type is assigned to it’s constructor. From there, the base type’s prototype is assigned to the \_\_ object’s prototype. To finish things up a new instance of the \_\_ object is created and assigned to the derived type’s prototype so it picks up prototype members from the base type. In the end, this little function provides a re-useable way to handle inheritance between two objects in JavaScript. If you’re new to prototypes then you’re probably appreciating the simplicity provided by the TypeScript **extends** keyword!

The \_\_extends function is used later in the generated JavaScript code to handle inheritance between Truck and Auto. An example of the code that’s generated to represent the Truck class is shown next:  
  
  

```
var Truck = (function (_super) {
    __extends(Truck, _super);
    function Truck(options) {
        _super.call(this, options);
        this.bedLength = options.bedLength;
        this.fourByFour = options.fourByFour;
    }
    Object.defineProperty(Truck.prototype, "bedLength", {
        get: function () {
            return this._bedLength;
        },
        set: function (value) {
            if(value == null || value == undefined || value == '') {
                this._bedLength = 'Short';
            } else {
                this._bedLength = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Truck;
})(Auto);
```

  
Notice that the Truck variable is assigned to a function that accepts a parameter named \_super. This parameter represents the base class to inherit functionality from. The function assigned to Truck is self-invoked at the bottom of the code and the base class to derive from (Auto in this example) is passed in for the value of the \_super parameter. The \_\_extends function discussed earlier is then called inside of the Truck function and the derived type (Truck) and base type (Auto) are passed in as parameters. The magic of inheritance then happens using prototypes as discussed earlier.  
  
  

# Conclusion  

In this post you’ve seen how TypeScript can be used to create an inheritance hierarchy and the resulting JavaScript that’s generated. You’ve also seen how interfaces can be created, implemented, and even extended using TypeScript.

Check out the [TypeScript Fundamentals course](http://pluralsight.com/training/Courses/TableOfContents/typescript) on [Pluralsight.com](http://www.pluralsight.com)  and see what TypeScript offers for both large-scale and small-scale JavaScript applications.
