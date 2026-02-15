---
title: "RxJS Error: \"Types of property 'source' are incompatible\" and How to Fix It"
date: 2019-10-12
categories: 
  - "javascript"
  - "typescript"
tags: 
  - "linking"
  - "multiple-versions"
  - "packages"
  - "rxjs"
coverImage: "wrenches.webp"
---

![](/images/blog/rxjs-error-types-of-property-source-are-incompatible/wrenches-1024x768.webp)

I'm working on an npm package that requires RxJS as a peerDependency which means that whatever app uses the package must also install RxJS. Since my npm package project needs RxJS to build, I add it as a **devDependency** which of course adds it into the node\_modules folder of the project.

To use my npm package locally in sample apps I have I do the following which is a nice trick to avoid having to publish the package to npm (which I don't want to do when I'm still working on it):

1. Run **npm link \[package-name\]** where package-name is name of the project folder (which will normally be your package name - if not adjust the package-name as appropriate).
2. Run **npm link \[@yourNpmOrganization\]/package-name\]** in the sample app that needs to reference the package project. If you don't use an npm organization just leave that part out and put the package-name value.
3. When you're done you can run **npm unlink \[@yourNpmOrganization\]/package-name\]** to unlink the app from the local package.

Doing this works great and I can update my package project and have it immediately affect the target application due to the npm linking. That saves me having to publish to npm everytime I update the project which is ideal for local testing.

After doing the linking everything was working great until one of the sample apps that I use to test the package project threw an RxJS error similar to the following:

> Types of property 'source' are incompatible

I've seen this error before and knew it was due to having a copy of RxJS (as a devDependency) in the package project's node\_modules folder and a copy of RxJS in the sample app's node\_modules folder. Having these two copies in the node\_modules folder causes issues even if the two RxJS copies are the same version.

While I could temporarily delete RxJS from the package project to get around the error that would defeat the purpose of linking since I needed RxJS in the project to build it. So, what to do?

The best solution I've found so far is to add the following configuration **paths** property into the sample app's **tsconfig.json** file (since it's a TypeScript project in this case):

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist",
    "sourceMap": true,
    "declaration": false,
    "module": "esnext",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2017",
      "dom"
    ],
    "paths": {
        "rxjs": [
          "node_modules/rxjs"
        ],
        "rxjs/*": [
          "node_modules/rxjs/*"
        ]
    }
  }
}
```

This forces the sample project to always use the root copy of RxJS in **node\_modules** and to ignore any others found nested in additional packages. While I wish there was another way to work around the issue, this approach gets the job done.
