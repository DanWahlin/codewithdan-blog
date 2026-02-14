---
title: "Using the Iterator Pattern in JavaScript"
date: 2019-04-06
categories: 
  - "javascript"
  - "typescript"
tags: 
  - "iterator"
  - "patterns"
---

<figure>

![Roller coaster in a park by Priscilla Du Preez](/images/blog/using-the-iterator-pattern-in-javascript/FOsina4f7qM.webp)

<figcaption>

Roller coaster in a park by Priscilla Du Preez

</figcaption>

</figure>

I recently had to parse some markdown using the [marked npm package](https://www.npmjs.com/package/marked) and convert it into JSON objects for a project I'm working on. When I parsed the markdown I'd get back an array of tokens that would look something like the following:

```json
[
  { "type": "heading", "depth": 1, "text": "Course: React Core Concepts" },
  { "type": "paragraph", "text": "In these workshop labs you'll learn about React core concepts and see how it can be used to build Single Page Applications (SPAs)." },
  { "type": "space" },
  { "type": "paragraph", "text": "Topics covered include:" },
  { "type": "space" },
  { "type": "list_start", "ordered": false, "start": "", "loose": false },
  { "type": "list_item_start", "task": false, "loose": false },
  { "type": "text", "text": "Creating and using components" },
  { "type": "list_item_end" },
  { "type": "list_item_start", "task": false, "loose": false },
  { "type": "text", "text": "Working with Data Binding" },
  { "type": "list_item_end" },
  { "type": "list_item_start", "task": false, "loose": false },
  { "type": "text", "text": "Using Axios to retrieve data from a server" },
  { "type": "list_item_end" },
  { "type": "list_item_start", "task": false, "loose": false },
  { "type": "text", "text": "Routing" },
  { "type": "space" },
  { "type": "list_item_end" },
  { "type": "list_end" }
]
```

I started out the "normal" way by doing a **for...of** loop to iterate through the tokens in the array. This worked, but tracking the start and end of a token meant adding extra variables which ultimately complicated the code. For example, how do you know if you're in a list? You track it with an **inList** variable or something similar. That works, but it could definitely be better especially since lists were only one of several types of objects I needed to track.

As the code progressed, I realized that sometimes I needed the **index** value as I was looping through the tokens. So, I changed the code to loop through the tokens using a standard **for** loop. While that worked, I still had the problem of tracking where I was in the overall object that was processed (such as a list of items) and it wasn't as simple as I wanted when I needed to move to the next token manually.

For example, to get all of the items in the list, I had to set an **inList** type of variable when the **list\_start** token was encountered. Then when the looping continued I had to look for **list\_item\_start**, and then the **text** token. Since I couldn't access **list\_start** and then easily move down 2 spots to the text I wanted, it was more challenging than it should have been. While I made it work, there were several other scenarios where I ran into this challenge as well.

Although I was able to get my first iteration of the code working fairly quickly, it felt really complex and didn't sit well with me at all. One of those moments where you realize that while the code works, you'll never be able to maintain it in the future without remembering all of the little variables that were added and how they were used. If I can't look at code in the future and get a quick feel for what it's doing without a lot of analysis, then the code is probably more complex than it needs to be.

I tweeted the following about the current state of the code since it was amusing how it started out so simple and then became so complex:

https://twitter.com/DanWahlin/status/1113641653347045377

I started the process of refactoring the code and came up with some good optimizations, but tracking "Where the hell am I...I'm lost!" in the token array was still challenging. After thinking about it more, considering other options such as map/filter, I decided to bite the bullet and refactor the code yet again to use the **[iterator pattern](https://en.wikipedia.org/wiki/Iterator_pattern)** to make it easy to know where I was in the process.

> The iterator pattern is a design pattern in which an iterator is used to traverse a container and access the container's elements.
> 
> [https://en.wikipedia.org/wiki/Iterator\_pattern](https://en.wikipedia.org/wiki/Iterator_pattern)

I realized early on that using this type of pattern might be easier (I used it a lot in other languages/frameworks), but I was too far down the rabbit hole to go back up. After reaching the bottom of the hole I realized it would be worth the time to convert the code.

I added the following code into the class I was working with to enable doing custom iterations over the tokens:

```typescript
tokenIterator(tokens: MarkdownToken[]) {
    let index = -1;
    return {
        next: () => {
            index++;
            if (index < tokens.length) {
                return { token: tokens[index], index, 
                         done: false };
            } else {
                return { done: true, index };
            }
        },
        peek: () => {
            if (index + 1 < tokens.length) {
                return { token: tokens[index + 1], 
                         index: index + 1, done: false }
            }
            else {
                return { done: true, index };
            }
        }
    }
}
```

This enabled me to easily move from to token to token without relying on some type of **for loop**. It also added the ability to "peek" at the next item without consuming it (more on this in a moment). If you've worked with Java, C#, or other languages you'll recognize this type of pattern since it's very common in many languages and one of the [GOF patterns](https://en.wikipedia.org/wiki/Design_Patterns).

By adding the token iterator I could now do something like the following to iterate through the tokens.

```typescript
this.currentResult = this.iterator.next();
while (!this.currentResult.done) {
    const token = this.currentResult.token;
    if (token.type === 'heading') {
        switch (token.depth) {
           case 1: // course
               ...
           case 2: // lab
               ...
           case 3: // exercise
               ...
           case 4: // step
               ...
        }
    }
    this.currentResult = this.iterator.next();
}
```

This meant that any time I needed to move to the next item I could simply call **this.iterator.next()**. That made working with nested child object scenarios MUCH easier overall. For example, working with a list meant iterating over the tokens until I found the **list\_item\_end** token. No additional state tracking was needed to know where I was in the tokens.

```typescript
let text = '';
let listToken = token;
while (listToken.type !== 'list_end') {
    if (listToken.type === 'text') {
        text += this.convertFromMarkdown(listToken.text.trim());
    }
    listToken = this.iterator.next().token;
}
```

By using the **peek()** function I could easily look at the next token without actually moving to it as well:

```typescript
parseChildren(currentNode) {
    this.currentResult = this.iterator.next();
    while (!this.currentResult.done) {
        // do work here

        // See if we should move next or not since we don't
        // want to move to a 'header' if the depth is < 5
        const peekResult = this.iterator.peek();
        if (peekResult.done || 
             (peekResult.token.type === 'heading' && 
              peekResult.token.depth !== 5)) {
            break;
        }
        this.currentResult = this.iterator.next();
    }
}
```

There are many more things that can be done to the iterator code to enhance it (such as adding support for custom predicates, "iterate until" type logic, etc.), but it's easy to get started using and works well in the right situation.

While the iterator pattern isn't new by any means and has been used in JavaScript for a long time, I hope the general thought process described here might save someone from going down the wrong rabbit hole and creating a vicious code monster. :-)

[Discuss on Twitte](https://twitter.com/search?src=typd&q=https%3A%2F%2Fblog.codewithdan.com%2Fusing-the-iterator-pattern-in-javascript%2F)[r](https://twitter.com/search?q=https:/blog.codewithdan.com/using-the-iterator-pattern-in-javascript/)
