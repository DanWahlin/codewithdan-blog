---
title: "New Pluralsight Course: Docker for Web Developers"
date: 2016-04-03
tags: 
  - "cloud"
  - "containers"
  - "docker"
  - "docker-compose"
  - "docker-machine"
  - "images"
  - "pluralsight"
  - "programming"
  - "webdevelopment"
---

## How I Got Into Docker (and why you should too)

One of the most exciting technologies that I’ve researched and used over the past year is [Docker](http://www.docker.com). That’s a pretty bold statement, especially since I enjoy working with a lot of different technologies, so let me share a quick story about how I initially got started with Docker and and my personal journey (if you’d prefer you can [jump directly to the Docker for Web Developers Course](https://www.pluralsight.com/courses/docker-web-development)).

You may have heard the term “Docker”[](https://blog.codewithdan.com/wp-content/uploads/2017/02/docker-logo-240.png) tossed around at work or online and wondered what it was…I know I did. I heard a few people mention it on Twitter a few years ago making claims like, “Docker provides a consistent way to deploy applications.” That sounded appealing but wasn’t enough to make me jump into it. I’ve worked in a lot of dev environments over the course of my career and have certainly run into challenges moving software between development, staging and production

[  
](https://blog.codewithdan.com/wp-content/uploads/2017/02/docker-logo-240-1.png)

environments so the general promise of Docker certainly intrigued me. But, when it came down to it I only had so many hours in the day to research new technologies so I pushed it off. It kept coming up again and again though so I realized I needed to make some time to look into it more.

Fast-forward a few more weeks and one night I decided to visit the [Docker website](http://www.docker.com) and do a little reading on the features it offered. The additional features I learned about continued to interest me but at the time I felt like Docker was aimed squarely at SysAdmins which wasn’t that exciting to me - no offense to my SysAdmin friends. :-) It was also 100% Linux-based when it first came out and I wasn’t a “Linux guy” back then. I was super comfortable with Mac and Windows but “Linux” just wasn’t my thing. I put off looking into it more but decided to sign-up for the [Docker Newsletter](https://www.docker.com/newsletter-subscription) just to keep an eye on it and see if anything interesting showed up. I read a lot of great articles that listed some of the key features:  
  

[](https://blog.codewithdan.com/wp-content/uploads/2017/02/dockerFeatures.png)

As I dug in deeper I learned that Docker allows “Images” published up on [Docker Hub](https://hub.docker.com/) to be used to create instances of running “Containers”. An image is a super efficient way to get a given framework (Node.js, ASP.NET Core, PHP, etc.), database servers, caching servers and much more up and running on your dev machine or even in production. What’s so cool about the Docker technology is that “Images” aren’t the same thing as the “Virtual Machine Images” you may have used before. In fact, Docker Images are very different from Virtual Machine Images as they’re typically smaller and more efficient to start and stop. A Docker Image isn’t a full OS as with Virtual Machines – it’s a layer that’s added onto a host OS so there are a lot of benefits that Docker Images bring to the table.  I’ll save that discussion for another post though. In the meantime, here’s a quick summation of Docker Images and Containers for you:

[](https://blog.codewithdan.com/wp-content/uploads/2017/02/dockerImagesContainers.png)

This still sounds/looks rather SysAdmin-ish though right? That’s what I thought initially too. Let’s get to the good stuff that can impact you and your development projects.

## How Docker Can Help Web Developers (and many others)

One day I saw an article in the [Docker Newsletter](https://www.docker.com/newsletter-subscription) that focused on a few key benefits that Docker offered to web developers. After reading it and thinking it over more I had one of those “light bulb moments” and thought, “Hey, this technology can be used to setup a consistent development environment quickly and easily! How cool is that?” What do I mean by that exactly?

Let’s say that you need to get Node.js, MongoDB, nginx, Redis and possibly more up and running on your dev machine. In addition to getting these requirements all installed properly, you also have to worry about getting security, configuration and more in place. To top it off, everyone on your team needs to do the same thing on their machines. Do you all have the correct versions of the servers and frameworks installed? What happens in a month or two when a new version comes out for a server/framework that everyone decides to move to? Is it easy to move to the new version? Did everyone configure security the same? How many hours have you (or your team) spent getting a development environment like that up and running correctly (and consistently) for a particular project? When a new developer or contractor comes onboard how quickly can they get to work? Whew – that’s way too many questions to ask and way too much work to do before you even write a single line of code (and yes…I realize there are many ways to automate some of this but rather than digressing I’ll stay focused on Docker here).

I’ve wasted more time than I care to admit in some cases setting up my dev environment for projects. The good news is that Docker can greatly simplify the process of creating a consistent development environment across multiple team members, remote workers, contractors and more. And – it can do it quickly! There are certainly other benefits as well. When I’m ready to move to staging or production I can move the exact environment (via Docker Images) and feel confident that the application is going to run the same in the other environments.

[](https://blog.codewithdan.com/wp-content/uploads/2017/02/dockerDeveloperFeatures.png)

Once I realized that Docker wasn’t just for SysAdmins (which is certainly an important role as well) and could play a huge role for developers I jumped in head first and have never looked back. Sure, there was a learning curve (after all – I did have to learn some Linux fundamentals) but I’ve quite honestly enjoyed the process every step of the way, appreciate the [documentation](https://docs.docker.com/) that the Docker website offers and enjoy working with the [tools](https://www.docker.com/products/docker-toolbox) provided by Docker such as **Docker Machine**, **Docker Client** and especially **Docker Compose**. I’ll be writing some posts in the near future about these tools and how they can be used so stay tuned. Follow me on Twitter at [@DanWahlin](http://twitter.com/danwahlin) if you’re interested in hearing about the latest posts.

And that brings us to the new course that I just released…

## The New Pluralsight Course: Docker for Web Developers

I’ve been using Docker for quite awhile now and am still super excited about the benefits it offers software developers. In fact, I was so excited about the features that I decided to create a full video course on [Pluralsight.com](https://www.pluralsight.com/courses/docker-web-development) which was recently released. The course has over 5 hours of in-depth information about why and how you’d use Docker in your Web development environment. Here’s a small sampling of some of the topics covered:

- Why use Docker as a Developer?
- The difference between Docker Images and Virtual Machines
- Installing Docker Toolbox on Mac and Windows
- The role of Docker Hub for pulling images
- Getting started quickly and easily with the Kitematic Tool
- Using Docker Machine to work with Linux on Mac and Windows
- Key Docker Machine and Docker Client commands
- How do you hook your source code into Docker?
- How do you build custom Docker images?
- How do multiple containers talk to each other at runtime?
- Bring up a complete development environment with Docker Compose
- Push custom images to Docker Hub
- Using Docker Cloud to deploy your images/containers to a cloud provider
- Much more!

Here’s the official course table of contents…

## Docker for Web Developers Video Course Outline

[](https://blog.codewithdan.com/wp-content/uploads/2017/02/dockerCourseBanner.png)

Docker's open app-building platform can give any web developer a boost in productivity. You'll learn how to use the Docker toolbox, how to work with images and containers, how to get your project running in the cloud, and more. [View the course here.](https://www.pluralsight.com/courses/docker-web-development)

1. Course Overview
2. Why Use Docker as a Developer?
3. Setting Up Your Dev Environment with Docker Toolbox
4. Using Docker Machine and Docker Client
5. Hooking Your Source Code into a Container
6. Building Custom Images with Dockerfile
7. Communicating Between Docker Containers
8. Managing Containers with Docker Compose
9. Running Your Containers in the Cloud
10. Reviewing the Case for Docker

I put a lot of blood, sweat, tears, late nights, head banging, head scratching, why won’t this s\*@? work moments, awesome – it works! moments, joy, excitement and more into the course so I really hope you enjoy it! [Get to the full course here!](https://www.pluralsight.com/courses/docker-web-development)
