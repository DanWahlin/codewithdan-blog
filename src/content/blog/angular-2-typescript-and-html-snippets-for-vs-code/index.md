---
title: "Angular, TypeScript and HTML Snippets for VS Code"
date: 2017-04-01
categories: 
  - "angular"
tags: 
  - "angular"
  - "html"
  - "javascript"
  - "typescript"
  - "vs-code"
---

[![](/images/blog/angular-2-typescript-and-html-snippets-for-vs-code/angular-e1459634290861.webp)](https://blog.codewithdan.com/wp-content/uploads/2016/03/angular-e1459634290861.png)I use [VS Code](http://code.visualstudio.com) a lot in my development projects and recently put together a set of [Angular (v2 or higher) TypeScript and HTML snippets](https://marketplace.visualstudio.com/items?itemName=danwahlin.angular2-snippets) that can be used to enhance productivity when building Single Page Applications.  By typing the snippet prefix (which is “ag-”) in a TypeScript or HTML file you can quickly add the associated code into your file.

Here’s a list of the supported snippets:

## Angular TypeScript Snippets

```
ag-Bootstrap                     - Bootstrap snippet
ag-AppModule                     - Create the root app module (@NgModule) snippet
ag-AppFeatureModule              - Angular app feature module (@NgModule) snippet
ag-AppFeatureRoutingModule       - Angular app feature routing module (@NgModule) snippet
ag-CanActivateRoutingGuard       - Create a CanActivate routing guard snippet
ag-CanDeactivateRoutingGuard     - Create a CanDeactivate routing guard snippet
ag-Component                     - Component snippet
ag-HttpService                   - Service with Http snippet (deprecated)
ag-HttpClientService             - Service with HttpClient snippet
ag-InputProperty                 - @Input property snippet
ag-InputGetSetProperty           - @Input property with get/set snippet
ag-OutputEvent                   - @Output event snippet
ag-Pipe                          - Pipe snippet
ag-Routes                        - Angular routes snippet
ag-Route                         - Route definition snippet
ag-Service                       - Service snippet
ag-Subscribe                     - Observable subscribe snippet

```

 

## Angular HTML Template Snippets

```
ag-ClassBinding              - [class] binding snippet
ag-NgClass                   - [ngClass] snippet
ag-NgFor                     - *ngFor snippet
ag-NgForm                    - ngForm snippet
ag-NgIf                      - *ngIf snippet
ag-NgModel                   - [(ngModel)] binding snippet
ag-RouterLink                - Basic routerLink snippet
ag-RouterLinkWithParameter   - [routerLink] with route parameter snippet
ag-NgSwitch                  - [ngSwitch] snippet
ag-NgStyle                   - [ngStyle] snippet
ag-Select                    - select control using *ngFor snipppet
ag-StyleBinding              - [style] binding snippet

```

In addition to typing the snippet prefix, you can also press Ctrl+Space on Windows or Linux, or Cmd+Space on Mac to activate the snippets.

## Installing the Angular TypeScript and HTML Snippets

```
Windows:  Select Ctrl+P and then type: ext install angular2-snippets
Mac:      Select ⌘+P and then type: ext install angular2-snippets

```

After restarting the editor open a TypeScript file and type the "ag-" prefix to see the snippets.

NOTE: The VS Code extension gallery doesn't allow projects to be renamed after they are initially created so "angular2-snippets" will get you the latest version of the snippets even though "2" is in the name.

The following [walk-through](https://code.visualstudio.com/docs/editor/extension-gallery) provides additional details.
