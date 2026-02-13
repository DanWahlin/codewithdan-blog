---
title: "Debugging jasmine-ts Unit Tests in VS Code"
date: 2019-10-11
categories: 
  - "javascript"
  - "typescript"
tags: 
  - "unittest"
coverImage: "debugging.jpg"
---

<figure>

![](/images/blog/debugging-jasmine-ts-unit-tests-in-vs-code/debugging-1024x594.jpg)

<figcaption>

Image created by Mohamed Hassan

</figcaption>

</figure>

I'm currently working on a project that relies on [jasmine-ts](https://www.npmjs.com/package/jasmine-ts) to run unit tests. While it's been working great, I encountered a bug in a unit test that required a lot more than a simple console.log() statement to figure out. I needed real debugging!

Since my unit tests were running and providing output directly to the console, the question became, "How do you attach to a jasmine-ts unit test in VS Code?". I found a few StackOverflow posts and finally went with something [mentioned here](https://stackoverflow.com/questions/50204143/debug-jasmine-tests-written-in-typescript-node-in-vs-code) (shout-out to **isaacfi** for providing the answer that actually worked).

To debug a jasmine-ts unit test spec directly in VS Code, add a new debug configuration (click the gear icon in the debug pane), and add the following into the launch.json file:

```json
"configurations": [
    {
      "type": "node", 
      "request": "launch", 
      "name": "Jasmine Current File", 
      "program": "${workspaceFolder}/node_modules/jasmine-ts/lib/index",
      "args": ["--config=./spec/jasmine.json", "${file}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
]
```

If my scenario I had my jasmine.json file in a "spec" subfolder so you may need to change that path for your setup. Once the launch.json file is in place you can open the target spec file, set a breakpoint, and start debugging away! An example of a project where I'm using this can be [found here](https://github.com/DanWahlin/Observable-Store).
