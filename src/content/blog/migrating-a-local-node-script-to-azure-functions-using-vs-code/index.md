---
title: "Migrating a Local Node Script to Azure Functions using VS Code"
date: 2022-09-21
categories: 
  - "microsoft-cloud"
tags: 
  - "azure"
  - "azure-functions"
  - "azure-key-vault"
  - "github"
  - "node"
  - "power-automate"
  - "typescript"
  - "vs-code"
---

I have a work project that uses GitHub APIs to access stats about specific repos (views, clones, forks, etc.). It was pretty straightforward to get the project running locally using GitHub's [Octokit REST package](https://www.npmjs.com/package/@octokit/rest) and with a little work I had a working Node script that could be run to retrieve the data and display it in the console. That was a good start, but the script functionality needed to be consumed by others in my organization as well as by services such as Power Automate. What to do?

While I could easily convert the script into a [Node/Express](https://www.npmjs.com/package/express) API and publish it to [Azure App Service](https://docs.microsoft.com/azure/app-service/overview), I decided to go with [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=nodejs) since when you boil the script down to the basics, its job is to handle a request and return data. It doesn't need to be constantly accessed so a consumption based model works well.

Here's the process I went through to convert my local script to an [Azure Function](https://docs.microsoft.com/azure/azure-functions/).

## 1\. Install the Azure Functions Extension for VS Code

<figure>

[![](/images/blog/migrating-a-local-node-script-to-azure-functions-using-vs-code/image-1024x606.png)](https://blog.codewithdan.com/wp-content/uploads/2022/08/image.png)

<figcaption>

Creating a Function using VS Code and Extensions

</figcaption>

</figure>

I wanted to develop the Azure Function locally and knew that the [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) could help with that. It allows you to do everything on your local machine and then publish to Azure Functions once you're ready.

To get started you can:

1. Open [my project](https://github.com/DanWahlin/GitHub-API-Demo) in VS Code.

3. Install the [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) (I already had it installed, but you'll want it).

5. Click on **Azure** in the VS Code sidebar.

7. Locate the **Workspace** section and click the **+** icon.

9. Select **Create Function**.

Since I only had a simple Node project at this point, I received the following prompt:

<figure>

[![](/images/blog/migrating-a-local-node-script-to-azure-functions-using-vs-code/image-1.png)](https://blog.codewithdan.com/wp-content/uploads/2022/08/image-1.png)

<figcaption>

Prompt to create an Azure Functions project.

</figcaption>

</figure>

From there I selected the following:

- **Language**: TypeScript

- **Trigger**: HTTP trigger

- **Function Name**: getGitHubRepoStats

- **Authorization level**: Anonymous

I was prompted to overwrite my existing **.gitignore** and **package.json** files. I said "yes" since I only had @octokit/rest in the Node dependencies list. It finished creating the project and displayed the shiny new function in the editor. It added the following into my project (in addition to a few other items):

<figure>

[![](/images/blog/migrating-a-local-node-script-to-azure-functions-using-vs-code/image-2.png)](https://blog.codewithdan.com/wp-content/uploads/2022/08/image-2.png)

<figcaption>

Files added by the Azure Functions extension.

</figcaption>

</figure>

Good progress! Time to get my existing code converted to an Azure Function.

## 2\. Merge the Local Script Code into the Azure Function

My initial script looked like the following:

```typescript
const { Octokit } = require("@octokit/rest");
const { v4: uuidv4 } = require('uuid');

// Create personal access token (with repo --> public rights) at https://github.com/settings/tokens
let octokit;
let ownersRepos;
let context;
getStats(context);

async function getStats(ctx) {
    context = ctx || { log: console.log }; // Doing this to simulate what's it like in Azure Functions
    ownersRepos = getRepos();
    context.log(ownersRepos);
    const stats = [];
    for (const repo of ownersRepos) {
        octokit = new Octokit({
            auth: repo.token
        });
        const ownerRepo = {
            owner: repo.owner,
            repo: repo.repo
        }

        const clones = await getClones(ownerRepo);
        const forks = await getTotalForks(ownerRepo);
        const views = await getPageViews(ownerRepo);

        stats.push(getTodayRow(ownerRepo, clones, forks, views));
    }
    context.log(stats);
    return stats;
}

function getRepos() {
    try {
        console.log(context);
        // Need to set env variable GITHUB_REPOS
        // export GITHUB_REPOS="[ { \"owner\": \"microsoft\", \"repo\": \"MicrosoftCloud\", \"token\": \"token_value\" } ]"
        const repos = JSON.parse(process.env['GITHUB_REPOS']);
        context.log('Repos:', repos);
        return repos;
    }
    catch (e) {
        context.log(e);
        return [];
    }
}

function getTodayRow(ownerRepo, clones, forks, views) {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      .toISOString().split('T')[0] + 'T00:00:00Z';

    const todayClonesViewsForks ={
        id: uuidv4(),
        timestamp: yesterday,
        owner: ownerRepo.owner,
        repo: ownerRepo.repo,
        clones: 0,
        forks: forks,
        views: 0
    };
    const todayClones = clones.clones.find(c => c.timestamp === yesterday);
    const todayViews = views.views.find(v => v.timestamp === yesterday);
    if (todayClones) {
        todayClonesViewsForks.clones = todayClones.count;
    }
    if (todayViews) {
        todayClonesViewsForks.views = todayViews.count;
    }
    return todayClonesViewsForks;
}

async function getClones(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-repository-clones
        const { data } = await octokit.rest.repos.getClones(ownerRepo);
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} clones:`, data.count);
        return data;
    }
    catch (e) {
        context.log(`Unable to get clones for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getTotalForks(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/repos/forks
        const { data } = await octokit.rest.repos.get(ownerRepo);
        const forksCount = (data) ? data.forks_count : 0;
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} forks:`, forksCount);
        return forksCount
    }
    catch (e) {
        context.log(e);
        context.log(`Unable to get forks for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getPageViews(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-page-views
        const { data } = await await octokit.rest.repos.getViews(ownerRepo);
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} visits:`, data.count);
        return data;
    }
    catch (e) {
        context.log(`Unable to get page views for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
        context.log(e);
    }
    return 0;
}   
```

The next step was to merge my script into the new Azure Function. Since the Azure Functions extension (with my permission) overwrote my **package.json** file, I ran **npm install @octokit/rest** to get the package back into the dependencies list.

At this point I had the following function code displayed in VS Code:

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;
```

Now that I had the shell created for the function, I created a new **getStats.ts** script in the **getGitHubRepoStats** function folder, copied in my initial code, and changed require statements to import statements at the top of the file. It looked like the following after finishing a few "tweaks":

```typescript
import { Octokit } from '@octokit/rest';
import { v4 as uuidv4 } from 'uuid';

// Create personal access token (with repo --> public rights) at https://github.com/settings/tokens
let octokit: Octokit;
let ownersRepos;
let context;

export async function getStats(ctx) {
    context = ctx || { log: console.log };
    ownersRepos = getRepos();
    const stats = [];
    for (const repo of ownersRepos) {
        octokit = new Octokit({
            auth: repo.token
        });
        const ownerRepo = {
            owner: repo.owner,
            repo: repo.repo
        }
        const clones = await getClones(ownerRepo);
        const forks = await getTotalForks(ownerRepo);
        const views = await getPageViews(ownerRepo);

        const yesterdayRow = getTodayRow(ownerRepo, clones, forks, views);
        stats.push(yesterdayRow);
    }

    return stats;
}

function getRepos() {
    try {
        const repos = JSON.parse(process.env['GITHUB_REPOS']);
        context.log('Repos:', repos);
        return repos;
    }
    catch (e) {
        context.log(e);
        return [];
    }
}

function getTodayRow(ownerRepo, clones, forks, views) {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
      .toISOString().split('T')[0] + 'T00:00:00Z';

    const todayClonesViewsForks ={
        id: uuidv4(),
        timestamp: yesterday,
        owner: ownerRepo.owner,
        repo: ownerRepo.repo,
        clones: 0,
        forks: forks,
        views: 0
    };
    const todayClones = clones.clones.find(c => c.timestamp === yesterday);
    const todayViews = views.views.find(v => v.timestamp === yesterday);
    if (todayClones) {
        todayClonesViewsForks.clones = todayClones.count;
    }
    if (todayViews) {
        todayClonesViewsForks.views = todayViews.count;
    }
    return todayClonesViewsForks;
}

async function getClones(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-repository-clones
        const { data } = await octokit.rest.repos.getClones(ownerRepo);
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} clones:`, data.count);
        return data;
    }
    catch (e) {
        context.log(`Unable to get clones for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getTotalForks(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/repos/forks
        const { data } = await octokit.rest.repos.get(ownerRepo);
        const forksCount = (data) ? data.forks_count : 0;
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} forks:`, forksCount);
        return forksCount
    }
    catch (e) {
        context.log(e);
        context.log(`Unable to get forks for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
    }
    return 0;
}

async function getPageViews(ownerRepo) {
    try {
        // https://docs.github.com/en/rest/metrics/traffic#get-page-views
        const { data } = await await octokit.rest.repos.getViews(ownerRepo);
        context.log(`${ownerRepo.owner}/${ownerRepo.repo} visits:`, data.count);
        return data;
    }
    catch (e) {
        context.log(`Unable to get page views for ${ownerRepo.owner}/${ownerRepo.repo}. You probably don't have push access.`);
        context.log(e);
    }
    return 0;
}
```

Next, I went into the **getGitHubRepoStats/index.ts** file, imported the **getStats.ts** script, and modified the body. Using this approach keeps the function nice and clean.

```typescript
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { getStats } from './getStats';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a GitHub repo stats request.');
    const stats = await getStats(context);
    context.log("The stats", stats);
    context.res = {
        body: stats
    };
};

export default httpTrigger;
```

I pressed F5 which then prompted me to install the "core" tools. After the installation completed, it showed several commands in the console, displayed the core tools version, built the code, and launched my new function locally. I hit the **http://localhost:7071/api/getGitHubRepoStats** URL shown in the console and....drumroll please....it actually worked! Getting projects to work the first time is rare for me so it was nice to have a quick "win" for once.

## 3\. Create a Function App in Azure

Now that the function was working locally it was time to deploy it to Azure. I stopped my debugging session, went to the command pallet (shift+cmd+p on Mac), and selected **Azure Functions: Create Function App in Azure**.

<figure>

[![](/images/blog/migrating-a-local-node-script-to-azure-functions-using-vs-code/image.png)](https://blog.codewithdan.com/wp-content/uploads/2022/09/image.png)

<figcaption>

Using the Azure Functions: Create Function App in Azure Option in VS Code

</figcaption>

</figure>

Once you select that option, you'll be prompted for:

- The Azure subscription to use

- The function name

- The runtime stack (I selected Node.js 16 LTS)

- The region

## 4\. Deploy the Azure Function Code

Once the Azure Function App is created you'll see a message about viewing the details. The next step is to deploy the code. That can be done by going back to the command pallet in VS Code and selecting **Azure Functions: Deploy to Function App**. You'll be asked to select your subscription and Function App name.

Once the function is created in Azure you can go to the Azure extension in VS Code, expand your subscription, expand your Function App, right-click on the function and select **Browse Website**. Add "/api/<your\_function\_app\_name>" to the URL and if all of the planets align, you should see data returned from your function.

<figure>

[![](/images/blog/migrating-a-local-node-script-to-azure-functions-using-vs-code/image-2.png)](https://blog.codewithdan.com/wp-content/uploads/2022/09/image-2.png)

<figcaption>

Using the Azure VS Code extension to browser your Azure Functions website

</figcaption>

</figure>

## 5\. Environment Variables and Key Vault

You might have noticed that the function code relies on an environment variable named **GITHUB\_REPOS**. I added that key and value into the **Values** property of the **local.settings.json** file which is used when running the function locally (that file isn't checked into source control).

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "GITHUB_REPOS": "[ { \"owner\": \"microsoft\", \"repo\": \"MicrosoftCloud\", \"token\": \"token-value\" }, { \"owner\": \"microsoft\", \"repo\": \"brainstorm-fluidframework-m365-azure\", \"token\": \"token-value\" } ]"
  }
}
```

I could deploy the function and have the **GITHUB\_REPOS** value show up automatically in the **Configuration --> Application Settings** section of the Function App (you'll see that section in the Azure Portal). In my case that wasn't good enough though. The **GITHUB\_REPOS** value has GitHub personal access tokens in it that are used to make the API calls. I needed a more secure solution when I ran the function in Azure.

To handle that, I created a new Azure Key Vault secret that included the data required for the **GITHUB\_REPOS** environment variable. I then went into **Configuration --> Application Settings** in the Function App and ensured that it had the following key/value pair:  
  

```properties
GITHUB_REPOS=@Microsoft.KeyVault(SecretUri=https://<your_key_vault_name>-vault.vault.azure.net/secrets/<your_secret_name>/)
```

To get the Function App to successfully talk with Azure Key Vault and retrieve the secret, you'll also need to create a managed identity. You can [find details about that process here](https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references).

## Conclusion

Migrating a custom script to Azure Functions is a fairly straightforward process especially if you're able to reuse a lot of your original code. In my case, it allowed me to expose the local script functionality to anyone and any app. While this particular function is publicly accessible, it's important to mention that you can also [secure your functions](https://learn.microsoft.com/en-us/azure/azure-functions/security-concepts) as needed.

Is that the end of the story? Not for me. I also needed to create a Power Automate flow to consume the data from the function and update a data store. That's a subject for another post though.  
  
The code shown in this repo can be found here: [https://github.com/DanWahlin/github-repo-stats](https://github.com/DanWahlin/github-repo-stats).

What's Next? The next post in this series titled [Use Power Automate to Retrieve Data from an Azure Function for Reporting](https://blog.codewithdan.com/use-power-automate-to-retrieve-data-from-an-azure-function-for-reporting/) demonstrates how to automate calling the Azure Function and storing the data.
