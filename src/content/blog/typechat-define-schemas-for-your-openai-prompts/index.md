---
title: "TypeChat: Define Schemas for Your OpenAI Prompts"
date: 2023-07-30
categories: 
  - "ai"
tags: 
  - "ai"
  - "azure-openai"
  - "llms"
  - "model"
  - "openai"
  - "typechat"
  - "typescript"
coverImage: "2023-07-31_00-29-32.png"
---

[![](/images/blog/typechat-define-schemas-for-your-openai-prompts/2023-07-31_00-28-24.webp)](https://blog.codewithdan.com/wp-content/uploads/2023/07/2023-07-31_00-28-24.png)

Have you ever spent hours carefully crafting the perfect OpenAI prompt, trying to coax your AI model into generating just the right response? As an AI developer, I know that struggle all too well especially when it comes to returning structured JSON. What if there was an easier way to retrieve JSON responses from OpenAI and Azure OpenAI models?

Meet [TypeChat](https://aka.ms/typechat) - an open source project from Microsoft that aims to make working with AI more efficient across different types of AI models by using TypeScript types (called "schemas"). Created by [Anders Hejlsberg](https://twitter.com/ahejlsberg) and team, TypeChat allows you to define structured schemas that are used along with your prompts. This schema-based approach brings more control and accuracy to your AI interactions and allows well-defined JSON structures to be returned.

In this post, I'll walk you through how TypeChat works and show how you can use it to enhance your AI projects. If you'd like to see a quick overview of TypeChat in action, check out the following "getting started" video.  
  
**Video: Getting Started with TypeChat, Schemas and OpenAI**

https://youtu.be/t4YStIA88Yo

Let's get started by comparing TypeChat with the OpenAI function calling feature.

## OpenAI Function Calling

OpenAI models such as **gpt-3.5-turbo-0613** support [function calling](https://platform.openai.com/docs/guides/gpt/function-calling) which can be used to retrieve structured JSON data in model responses. Here's an example of a curl call that demonstrates what an OpenAI function call looks like:

```bash
curl https://api.openai.com/v1/chat/completions -u :$OPENAI_API_KEY -H 'Content-Type: application/json' -d '{
  "model": "gpt-3.5-turbo-0613",
  "messages": [
    {"role": "user", "content": "Schedule a meeting with Jane Doe on August 1, 2023 at 1 pm pacific time."}
  ],
  "functions": [
    {
      "name": "create_meeting",
      "description": "Create a meeting",
      "parameters": {
        "type": "object",
        "properties": {
          "attendee": {
            "type": "string",
            "description": "Attendee to invite"
          },
          "date": {
            "type": "string",
            "description": "Meeting date"
          },
          "time": {
            "type": "string",
            "description": "Meeting time"
          }
        }
      }
    }
  ]
}'
```

Notice that a specific model is being used (gpt-3.5-turbo-0613 in this example) and a function named **create\_meeting** is defined as well as the parameters that the function expects to receive. This type of OpenAI function call returns a response similar to the following:

```json
{
  "id": "chatcmpl-7iBcirMinlxNhSaWQMjNIqZnj1N3Y",
  "object": "chat.completion",
  "created": 1690765468,
  "model": "gpt-3.5-turbo-0613",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "function_call": {
          "name": "create_meeting",
          "arguments": "{\n  \"attendee\": \"Jane Doe\",\n  \"date\": \"August 1, 2023\",\n  \"time\": \"1 pm\"\n}"
        }
      },
      "finish_reason": "function_call"
    }
  ],
  "usage": {
    "prompt_tokens": 89,
    "completion_tokens": 39,
    "total_tokens": 128
  }
}
```

Note that the **arguments** property in the response contains JSON data that matches the parameters defined in the function call (also note that you'd have to deal with timezones on your own - fun, fun).

```json
{ 
  "attendee": "Jane Doe",
  "date": "August 1, 2023",
  "time": "1 pm"
}
```

By using the function calling feature you can get back the exact JSON data you desire. However, this only works if you're using a model that supports function calling. What if you're not using a model that supports this feature? Or, what if you'd prefer to use TypeScript "schemas" to define the specific JSON data you'd like returned? That's where TypeChat comes into play!

## Schemas: Moving Beyond Textual Prompts

At its core, TypeChat simplifies and streamlines AI development. You no longer have to rack your brain composing the perfect text prompt. By defining schemas upfront using TypeScript, you can focus on building the overall logic and deliver accurate results faster. TypeChat handles dynamically embedding the schema as it interacts with the AI model. Whether you're creating tutorials, voice assistants, or any other AI application, TypeChat can help enhance precision and productivity.

With traditional prompt engineering, you provide text prompts and hope the model interprets them correctly. But as we all know, language can be ambiguous even if you're crystal clear about what you're expecting. TypeChat provides a more precise method by letting you define schemas that specify the expected input and output types. For example, you can define a schema for a restaurant order containing fields like food items, sides, quantities, and more.

## Getting Started with TypeChat

Interested in trying TypeChat? Get started by checking out the [TypeChat GitHub repository](https://github.com/microsoft/TypeChat). You can clone the repo or run it directly using [GitHub Codespaces](https://docs.github.com/codespaces/overview) (I show how to use Codespaces in the [video overview](//www.youtube.com/watch?v=t4YStIA88Yo) mentioned earlier). The **examples** folder contains several useful code samples to help you understand TypeChat's capabilities, examine schemas, and learn more about using the TypeChat API.

TypeChat works with both OpenAI and Azure OpenAI, so pick your preferred platform and set up the credentials in the **.env** file as mentioned in the **[examples/readme.md](https://github.com/microsoft/TypeChat/blob/main/examples/README.md#step-3-configure-environment-variables)** file.

## Schema-Based Engineering in Action

Let's look at how schema engineering improves a real-world use case like taking food orders. Without TypeChat, you'd have to provide text prompts such as the following. Note that this is an overly simplistic prompt.

> Take this food order from the customer: a large cheese pizza and a side of breadsticks. Convert the order into JSON data that looks like the following:  
>   
> { "items": \[ { "name": "", "size": "", "toppings": \[""\] }\], "sides": \[""\] }  
>   
> Only return JSON data and no other text content.

While OpenAI models are generally good at following rules defined in a prompt, you can certainly get unexpected results at times. Even though the previous prompt asks for JSON, it's possible to get back text as well as the JSON data you're expecting.  
  
**Note:** This challenge is covered in an Azure OpenAI tutorial available at [https://aka.ms/openai-acs-msgraph](https://aka.ms/openai-acs-msgraph) if you're interested in learning more about working with OpenAI Large Language Models (LLMs) and prompts.  
  
With TypeChat, a schema can be used to define the expected model output structure upfront:

```json
// An order from a restaurant that serves pizza, beer, and salad
export type Order = {
    items: (OrderItem | UnknownText)[];
};

export type OrderItem = Pizza | Beer | Salad | NamedPizza;

export type Pizza = {
    itemType: 'pizza';
    // default: large
    size?: 'small' | 'medium' | 'large' | 'extra large';
    // toppings requested (examples: pepperoni, arugula)
    addedToppings?: string[];
    // toppings requested to be removed (examples: fresh garlic, anchovies)
    removedToppings?: string[];
    // default: 1
    quantity?: number;
    // used if the requester references a pizza by name
    name?: "Hawaiian" | "Yeti" | "Pig In a Forest" | "Cherry Bomb";
};

export interface NamedPizza extends Pizza {
}

export type Beer = {
    itemType: 'beer';
    // examples: Mack and Jacks, Sierra Nevada Pale Ale, Miller Lite
    kind: string;
    // default: 1
    quantity?: number;
};

export const saladSize = ['half', 'whole'];

export const saladStyle = ['Garden', 'Greek'];

export type Salad = {
    itemType: 'salad';
    // default: half
    portion?: string;
    // default: Garden
    style?: string;
    // ingredients requested (examples: parmesan, croutons)
    addedIngredients?: string[];
    // ingredients requested to be removed (example: red onions)
    removedIngredients?: string[];
    // default: 1
    quantity?: number;
};
```

Once the schema is created, you feed it into the TypeChat API. Here's a quick summary of the key API functions used to combine a schema with a user prompt and send it to an LLM. The following code is from the **restaurants** example in the [TypeChat repo](https://github.com/microsoft/TypeChat).

```typescript
// Create an OpenAI or Azure OpenAI model object depending on 
// the properties defined in the .env file
const model = createLanguageModel(process.env);

// Read in the schema to use
const viewSchema = fs.readFileSync(
  path.join(__dirname, "foodOrderViewSchema.ts"),
  "utf8"
);

// Create a TypeChat JSON translator
const translator = createJsonTranslator<Order>(model, viewSchema, "Order");

// Call the JSON translator's translate() function and pass
// the user request (restaurant order in this example)
const response = await translator.translate(request);
if (!response.success) {
  console.log(response.message);
  return;
}
const order = response.data;
if (order.items.some((item) => item.itemType === "unknown")) {
  console.log("I didn't understand the following:");
  for (const item of order.items) {
    if (item.itemType === "unknown") console.log(item.text);
  }
}
printOrder(order);
```

The [translate() function](https://github.com/microsoft/TypeChat/blob/main/src/typechat.ts#L92) calls a **createRequestPrompt()** function internally to combine the user prompt with the schema:

```typescript
function createRequestPrompt(request: string) {
    return `You are a service that translates user requests into JSON objects of type "${validator.typeName}" according to the following TypeScript definitions:\n` +
        `\`\`\`\n${validator.schema}\`\`\`\n` +
        `The following is a user request:\n` +
        `"""\n${request}\n"""\n` +
        `The following is the user request translated into a JSON object with 2 spaces of indentation and no properties with the value undefined:\n`;
}
```

## Handling Ambiguous Input

TypeChat can help a model return the expected JSON data. No more guessing how the AI will interpret your prompts. However, challenges still arise from time to time.

One of TypeChat's superpowers is gracefully handling unknown or ambiguous terms in natural language. For example, let's say a customer orders a "Boar in a Blanket" pizza that's not on the menu. TypeChat works with the AI model to extract the relevant details from an unfamiliar prompt and provide an accurate response based on the defined schema. Unknown items are defined in the schema as shown next:

```typescript
// Use this type for order items that match nothing else
export interface UnknownText {
    itemType: 'unknown',
    text: string; // The text that wasn't understood
}
```

This ability to process fuzzy natural language makes TypeChat ideal for voice assistants, chatbots, and more where interpreting user intent isn't always an exact science.

## Validating Output

In addition to using the input schema with the user prompt, TypeChat also handles validating the model's responses against your defined schema. This gives you an extra layer of control and ensures the output matches your specifications.

For example, you can catch missing fields or data type mismatches during validation. This helps enhance the reliability of your AI system. Once a response is received from a model, the **translate()** function calls the [following code to validate the response](https://github.com/microsoft/TypeChat/blob/main/src/typechat.ts#L107) against the schema:

```typescript
const validation = validator.validate(jsonText);
if (validation.success) {
    return validation;
}
if (!attemptRepair) {
    return error(`JSON validation failed: ${validation.message}\n${jsonText}`);
}
```

## Summary

Although using textual prompts works well in many scenarios, when you need to receive structured JSON data back from a model, TypeChat provides an efficient and clean way to do that using schemas. It works across different types of models so you don't have to worry about a model supporting a specific feature (other than AI completion capabilities). Check out the TypeChat docs to learn more about how to get started using it and watch the [Getting Started with TypeChat, Schemas and OpenAI](https://www.youtube.com/watch?v=t4YStIA88Yo) video to see it in action.

As mentioned earlier, [OpenAI function calling](https://platform.openai.com/docs/guides/gpt/function-calling) can also be used to return specific JSON data although it requires that you use a model that supports that feature. It's worth exploring so that you understand all of the available options.

[TypeChat is an open source project](https://github.com/microsoft/TypeChat) actively maintained by Microsoft. Join the growing community on GitHub to share ideas and shape the future of the technology.

Found this information useful? Please share it with others and follow me to get updates:

- Twitter - [https://twitter.com/danwahlin](https://twitter.com/danwahlin)

- LinkedIn - [https://www.linkedin.com/in/danwahlin](https://www.linkedin.com/in/danwahlin)
