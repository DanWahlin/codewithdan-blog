---
title: "Using RealTime AI - Part 1: Getting Started with the Fundamentals of Low-Latency AI Magic"
date: 2025-03-14
categories: 
  - "ai"
tags: 
  - "angular"
  - "node-js"
  - "realtime-ai"
  - "typescript"
  - "websockets"
coverImage: "image-8.png"
---

Have you ever wished your AI could keep up with you—like, actually match your pace? You know, the kind of speed where you toss out a question and get a snappy reply before you’ve even blinked twice? Enter **Realtime AI**—a total game-changer that I'll have to admit had me grinning like I had just unlocked a secret superpower the first time I got it running.

In this first installment of the RealTime AI series, I’ll break down what Realtime AI is for you, why it’s awesome, and provide you with a first look at the [RealTime AI App](https://github.com/DanWahlin/RealtimeAIApp-JS)—a fun demo app that brings this tech to life. Let’s jump in!

## What’s RealTime AI All About?

Imagine traditional AI as that friend who takes awhile to text back—you send a message, twiddle your thumbs, and hope they reply before you’ve lost interest. RealTime AI, though? It’s like a live call—immediate, fluid, and right there with you. Powered by the [**OpenAI Realtime API** and model](https://platform.openai.com/docs/guides/realtime), it’s designed to deliver low-latency, multimodal magic, processing voice and text inputs in milliseconds for conversations that feel as natural as chatting with a friend.

The secret? It’s built on models like _gpt-4o-realtime_ optimized for real-time action. The realtime models handle everything from voice activation detection to audio streaming, and even throw in function calling support to let your AI take action—like pulling up customer info, formatting the response a specific way, or placing an order mid-chat. It’s a one-stop shop for building seamless, expressive experiences, without resorting to multiple calls to different AI models. What's really great about it is its support for audio or text inputs from the user.

## Why It’s a Big Deal

Have you ever tried cobbling together a voice assistant with separate speech recognition, text processing, and text-to-speech models? It can be challenging and enough to make you want to pull your hair out. The RealTime API flips that script. It streams audio inputs and outputs directly, handles interruptions like a seasoned conversationalist (think ChatGPT’s advanced voice mode), and does it all with a single API call.

An app with RealTime AI support can:

- Teach a user a language and even check their pronounciation.

- Allow a user to speak to a form and have it filled out automatically.

- Provide a user information about employee benefits as they talk with the RealTime AI assistant.

- Allow a customer to place an order using their voice, check an order's status, and more.

- Many more scenarios...

## RealTime AI App in Action

The **[RealTime AI App](https://github.com/DanWahlin/RealtimeAIApp-JS)** is a web-based project that I wrote using Angular on the front-end and Node.js on the back-end. It really shows off what this tech can do and provides two main features.

- **Language Coach**: Speak a phrase like “Hola, ¿cómo te llamas?” and it’ll chime in with, “Nice, but emphasize the ‘c’ more in 'cómo'!” It’s your patient and kind language and pronunciation tutor.

[![](/images/blog/using-realtime-ai-part-1-getting-started-with-the-fundamentals-of-low-latency-ai-magic/image-9-1024x847.png)](https://blog.codewithdan.com/wp-content/uploads/2025/03/image-9.png)

- **Medical Form Assistant**: Say “Patient John Smith, 42 years old, history of pneumonia” and it returns a JSON object like { "name": "John Smith", "age": "42", "notes": "pneumonia" } and fills in a form for you. Medical assistants, nurses, and doctors can speak directly to a form (no keyboard required) as they're busily hurrying around a hospital environment and have the form automatically filled in with patient details.

[![](/images/blog/using-realtime-ai-part-1-getting-started-with-the-fundamentals-of-low-latency-ai-magic/image-10-1024x916.png)](https://blog.codewithdan.com/wp-content/uploads/2025/03/image-10.png)

Since there are several parts to the RealTime AI App, I'll break it down into individual pieces for you through a series of posts that follow. In the meantime, here's a high-level overview of the key parts of the app.

- **Client**: This is you—the user interacting with the app via your browser. It sends audio or text inputs (like saying “Hello” or typing a question) to kick things off. It's written using Angular.

- **RealTime Session**: The Node.js code where the main action takes place - it manages the flow. It uses a client WebSocket to receive your inputs and send back responses, while a RealTime AI WebSocket connects to the OpenAI API. The logic block processes messages, ensuring everything runs smoothly between the client and the AI.

- **OpenAI RealTime API**: This is the brains of the operation. It receives audio/text from the Realtime Session, processes it with the gpt-4o-realtime model, and sends back audio/text responses. The app supports calling OpenAI or Azure OpenAI.

[![RealTime AI App diagram showing the client, realtime session, and OpenAI realtime interaction.](/images/blog/using-realtime-ai-part-1-getting-started-with-the-fundamentals-of-low-latency-ai-magic/image-8-559x1024.png)](https://blog.codewithdan.com/wp-content/uploads/2025/03/image-8.png)

## What’s Next?

This is just the start! In **Part 2**, I’ll dive into the server-side details—Node.js, WebSockets, and some code to tie it all together. You'll also see how prompts play a key role in determining the type of responses returned to the user. Stay tuned!

**Found this helpful?** Share it with your crew and follow me for the next installment:

- Twitter: [@danwahlin](https://twitter.com/danwahlin)

- LinkedIn: [Dan Wahlin](https://www.linkedin.com/in/danwahlin)
