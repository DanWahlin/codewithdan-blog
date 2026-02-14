---
title: "New Pluralsight Course - Kubernetes for Developers: Deploying Your Code"
date: 2020-02-29
categories: 
  - "containers"
  - "docker"
  - "kubernetes"
tags: 
  - "blue-green-deployments"
  - "canary-deployments"
  - "cronjobs"
  - "deployments"
  - "kubectl"
  - "monitoring"
  - "rolling-updates"
  - "troubleshooting"
  - "yaml"
coverImage: "2019-03-10_16-06-42.png"
---

[![](/images/blog/new-pluralsight-course-kubernetes-for-developers-deploying-your-code/2020-02-29_18-54-59-1024x272.webp)](https://pluralsight.pxf.io/bo0jv)

I’m excited to announce the release of my next course on Pluralsight titled [Kubernetes for Developers: Deploying Your Code](https://pluralsight.pxf.io/bo0jv)! This course is the next in the Kubernetes for Developers learning path and focuses on different techniques that can be used to deploy your containerized applications to Kubernetes. It follows the [Kubernetes for Developers: Core Concepts](https://pluralsight.pxf.io/R9W2N) course.

Here's the recommended order for taking my courses that cover containers and Kubernetes:

1. [Docker for Web Developers](https://pluralsight.pxf.io/Nqm2V)
2. [Kubernetes for Developers: Core Concepts](https://pluralsight.pxf.io/R9W2N)
3. [Kubernetes for Developers: Deploying Your Code](https://pluralsight.pxf.io/bo0jv)

Here are a few questions this course will help you answer:

- What is a Kubernetes Deployment and how do I create one?
- What are the benefits of using Deployments?
- What kubectl commands can be used to create or modify a Deployment?
- What if the Deployment has a problem - how do I rollback?
- What is a Rolling Update and how does it work?
- Can I control the minimum and maximum number of Pods available during a Rolling Update?
- What is a Canary Deployment and why would I want to use that technique?
- What are the advantages of a Blue-Green Deployment?
- What role do Kubernetes Services play with Canary and Blue-Green Deployments?
- What are Jobs and CronJobs?
- How do I create a Job on a scheduled basis (CronJob)?
- How important is it to monitor Kubernetes?
- What monitoring tools are available to monitor Deployments and other Kubernetes resources?
- How can I use kubectl to troubleshoot Deployments that are having an issue?
- And much more…

Here’s a quick visual summary of what the course covers:

# [Kubernetes for Developers: Deploying Your Code](https://pluralsight.pxf.io/bo0jv)

Deploying code to different environments can be challenging! In the Kubernetes for **Developers: Deploying Your Code** course you’ll learn about different deployment techniques that can be used to ensure your code and applications work correctly. The course starts out by providing a look at how deployments work in Kubernetes. This includes showing how to define a deployment using YAML and migrate it to Kubernetes using the kubectl tool. From there you'll learn how Rolling Deployments work, the benefits they offer, and how you can roll back a deployment if something goes wrong. 

Next, you'll learn about Canary Deployments, the role they can play to ensure code updates run properly, and when they're appropriate to use. Blue-Green Deployments are discussed next. With this Deployment technique you can roll out a new version of a Deployment, test it to ensure it works properly, and then route production traffic to it once it's deemed ready. You'll then learn about Jobs and CronJobs. Learn how to run a one-time job or even run a job on a schedule using the Cron format.

Finally, you'll learn about different monitoring and troubleshooting tools such as Prometheus and Grafana that can be used to monitor Kubernetes and provide alerts when things go wrong. You'll also learn key troubleshooting commands that you can run to obtain more information about problems that arise. When you’re finished with this course, you’ll have the skills and knowledge required to deploy your code and ensure it works properly in a Kubernetes cluster.

# Course Modules

1. Course Overview
2. Kubernetes Deployments Overview
    - Overview, Prerequisites, and Code Samples
    - Introduction
    - Kubernetes Deployments Overview
    - Creating an Initial Deployment
    - Kubernetes Deployments in Action
    - Kubernetes Deployment Options
    - Summary
3. Performing Rolling Update Deployments
    - Introduction
    - Understanding Rolling Update Deployments
    - Creating a Rolling Update Deployment
    - Rolling Update Deployment in Action
    - Rolling Back Deployments
    - Rolling Back Deployments in Action
    - Summary
4. Performing Canary Deployments
    - Introduction
    - Understanding Canary Deployments
    - Creating a Canary Deployment
    - Canary Deployments in Action
    - Summary
5. Performing Blue-Green Deployments
    
    - Introduction
    - Understanding Blue-Green Deployments
    - Creating a Blue-Green Deployment
    - Blue-Green Deployments in Action - The Blue Deployment
    - Blue-Green Deployments in Action - The Green Deployment
    
    - Summary
6. Running Jobs and CronJobs
    - Introduction
    - Understanding Jobs
    - Understanding CronJobs
    - Creating a Job and CronJob
    - Jobs in Action
    - CronJobs in Action
    - Summary
7. Performing Monitoring and Troubleshooting Tasks
    - Introduction
    - Monitoring and Troubleshooting Overview
    - Web UI Dashboard in Action
    - Metrics Server, kube-state-metrics, and Prometheus in Action
    - Grafana in Action
    - Troubleshooting Techniques with kubectl
    - Troubleshooting Techniques in Action
    - Summary
8. Putting It All Together
    - Reviewing Deployment Options

I hope you enjoy [the course](https://pluralsight.pxf.io/bo0jv) and learn more about different Deployment options and techniques that can be used with Kubernetes!
