---
title: "Docker for Developers: Understanding the Core Concepts"
date: 2023-06-27
categories: 
  - "docker"
tags: 
  - "azure"
  - "benefits"
  - "containers"
  - "deployment"
  - "images"
coverImage: "docker-small.png"
---

[![](/images/blog/docker-for-developers-understanding-the-core-concepts/Docker-Logo-1024x576.png)](https://blog.codewithdan.com/wp-content/uploads/2023/06/Docker-Logo.png)

This post is based on a section from my [Docker for Web Developers course](https://app.pluralsight.com/library/courses/docker-web-development/table-of-contents) on Pluralsight.

## Introduction

Docker and containers in general continue to receive a lot of attention, and it's well-deserved. But, you may have found yourself wondering, "What exactly is Docker? Can it be useful for developers like me?" When I first encountered Docker at conferences and user group talks, I wondered whether it had a place in my overall work flow and how I'd use it in different environments such as development, staging, and production. But as I dug deeper, I discovered that Docker can significantly impact our development operations.

In this post, I will start by explaining what Docker is and provide clarification on key terms and concepts essential for understanding Docker's functionality and utilization. Then, I'll dive into the benefits that Docker offers to developers, along with some of the tools available.

Let's begin by addressing the fundamental question, "What is Docker?".

## What Is Docker?

Docker is a lightweight, open, and secure platform for shipping software. That's the official definition you'll often come across. However, when I first encountered this general statement, it didn't immediately resonate with me because there are several technologies that could fit the description of a "lightweight, open, secure platform." Let's explore this further.

Docker simplifies the process of building applications, shipping them, and running them in various environments. By environments, I'm referring to development, staging, production, and other on-premises or cloud-based setups you may have.

So, what exactly does Docker include? The primary components are images, containers, and the supporting tools. You may have seen the Docker logo, featuring a whale carrying containers. To understand this analogy better, let's take a brief look back at the shipping industry's history.

Back in the old days, there was less standardization for loading and shipping products on ships (you've likely seen pictures of the old ships with crates and barrels). It was time intensive and not very productive to get products on and off a ship.

![Schooner, Vintage, Sailing, Sail, Ship, Boat, Sea](/images/blog/docker-for-developers-understanding-the-core-concepts/schooner-487800_960_720.jpg)

Today, the major shipping companies have very standardized shipping containers. As a crane positions itself over a ship when it docks, it's very quick, efficient, and productive to get those containers on and off the ship. If you're interested, you can read about the [history of shipping containers](https://www.freightos.com/the-history-of-the-shipping-container/) and how [Malcom McLean](https://en.wikipedia.org/wiki/Malcom_McLean) revolutionized the shipping industry.

Docker is very similar. If you think of the old days with ships that had few standards for shipping products around, that's where development and deployment were for many years. Everyone did it their own way.

Docker provides a consistent way to ship code around to different environments. As a result, it provides several key benefits to developers. As a developer, you can use Windows, Mac, or Linux to leverage Docker in your development workflow and run software on your machine without doing a traditional installation. This is due to Docker's support for something called "images".  

## Images and Containers

Docker relies on images and containers:

[![](/images/blog/docker-for-developers-understanding-the-core-concepts/2022-01-11_00-07-11-1024x564.png)](https://blog.codewithdan.com/wp-content/uploads/2022/01/2022-01-11_00-07-11.png)

An image has the necessary files to run something on an operating system like Ubuntu or Windows. It'll have your application framework or database, files that support the application, environment variables, security settings, and more. If you're doing Node.js, ASP.NET Core, PHP, Python, Java, or something else, you'll have that framework built into the image as well as your application code. You can think of the image as a blueprint that's used to get a container up and running.

To draw a parallel with shipping, imagine a person creating CAD drawings or blueprints that dictate how the container's contents will be organized. These blueprints alone are not useful, but they facilitate the creation of container instances and content organization. This process is analogous to creating Docker images.

Specifically, an image is a read-only template with a layered file system. It consists of files specific to the underlying Linux or Windows operating system, framework files, configuration files, and more. All these files are stacked in layers, collectively forming an image.

[![](/images/blog/docker-for-developers-understanding-the-core-concepts/image-1024x332.png)](https://blog.codewithdan.com/wp-content/uploads/2022/03/image.png)

Once you have an image, you can build a container from it. Returning to the shipping analogy, each container on a ship is isolated from the others. The contents of one container are unknown to the others. Similarly, when an image is created, you can start, stop, and delete containers based on that image. This technology offers the advantage of quickly and easily managing containers in various environments such as development, staging, and production.

[![](/images/blog/docker-for-developers-understanding-the-core-concepts/image-1-1024x253.png)](https://blog.codewithdan.com/wp-content/uploads/2022/03/image-1.png)

## Where Does Docker Run?

Where does Docker run then? Docker can run natively on Linux or Windows. Linux containers (such as the nginx server) can be run directly on a Linux machine. If you're running the container on Mac or Windows, you'll need a virtual machine or in the case of Windows you can leverage the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about) (WSL). Windows containers can be run directly on Windows machines.

Fortunately, Docker services can easily be run on Mac, Windows, or Linux machines using [Docker Desktop](https://www.docker.com/get-started) or another tool such as [Rancher Desktop](https://rancherdesktop.io/). They both provide container management clients (an "engine" if you will) that can be used to work with images and containers.

[![](/images/blog/docker-for-developers-understanding-the-core-concepts/image-2.png)](https://blog.codewithdan.com/wp-content/uploads/2022/03/image-2.png)

## Docker Containers versus Virtual Machines

You may be wondering about the differences between Docker containers and virtual machines. Virtual machines always run on top of a host operating system. This means that if you have a host running Linux or Windows, you can run a guest operating system on it using a hypervisor. The following image illustrates this:

[![](/images/blog/docker-for-developers-understanding-the-core-concepts/image-3-1024x572.png)](https://blog.codewithdan.com/wp-content/uploads/2022/03/image-3.png)

On the left side of the image, there's App 1, an ASP.NET Core app with its binaries and libraries. You'll also see App 2 running a different guest operating system and a different application. Let's assume the guest OS on the left is Windows, and the one on the right is Linux. In this setup, each virtual machine contains a complete copy of the operating system, resulting in significant overhead in terms of storage and memory. Starting and stopping a virtual machine can also be time-consuming, depending on the available server resources.

In contrast, Docker containers also run on top of a host operating system, whether it's Linux or Windows server. The host requires a container engine like Docker Engine to integrate the containers with the host OS. In the right part of the previous image, the host operating system represents the ship, capable of carrying multiple containers (e.g., App 1 and App 2). While App 1 and App 2 may be completely different containers, they don't require duplicating entire guest operating systems like in the case of virtual machines. You can run containers for your database, caching server, application code, framework, and more. Each container has its own CPU utilization, memory, and storage requirements, but you avoid the overhead of running multiple operating systems.

Now that we've covered images, containers, and their runtime environments, let's explore how Docker can benefit us as web developers.

## Docker Benefits for Developers

Docker offers various benefits to web developers, and in this section, we'll discuss some of the key advantages we can leverage. Whether you work individually or as part of a team, Docker can expedite the setup of development environments. While this benefit may seem minor, it significantly aids web developers. Additionally, Docker can help eliminate application conflicts. If you encounter compatibility issues when trying to upgrade to the latest framework version, isolated containers can provide a solution. Furthermore, Docker enables the seamless transfer of code and its entire environment across different environments, such as development, staging, and production. Ultimately, these advantages contribute to faster software shipping. Let's walk through a few of the key benefits in more detail.

**Accelerating Developer Onboarding**  
  
When working with teams that include developers, designers, or those with hybrid roles, it's crucial to have everyone working on the actual application rather than separate prototypes. Typically, a project involves web servers, database servers, caching servers, and more. Setting up these components on individual developer machines, especially for remote team members, can be challenging. It requires careful configuration, ensuring security, and managing version compatibility. Docker simplifies this process by allowing the creation of one or more images that can be transformed into running containers. These containers can then be deployed across different developer and designer machines.

**Eliminating App Conflicts**  
  
Often, an application runs on a specific framework version, and upgrading to the latest version becomes problematic due to compatibility concerns with other applications on production servers. Docker resolves this issue through isolated containers. Each container can house a specific version of the framework, providing a conducive environment for multiple applications. For instance, App 1, 2, and 3 can run smoothly in their respective containers, each targeting a different version of the framework. With Docker, managing versioning and app conflicts becomes significantly easier, even if your framework lacks robust versioning capabilities.

**Consistency Between Environments**  
  
Inconsistencies between development and staging environments can lead to unexpected surprises and additional development work. I recall a project from around the year 2000 when I encountered these types of challenges. The development environment and staging environment were supposed to be identical, but they turned out to be different in subtle ways. As a result, we had to rework parts of the code when transitioning from development to staging. Docker mitigates these surprises by allowing the seamless transfer of images to different environments. By ensuring that an application runs consistently across development, staging, and production, Docker eliminates many potential issues.

**Shipping Software Faster**  
  
By leveraging Docker's container isolation, consistent development environments, and other benefits discussed earlier, we gain the ability to ship code faster. Ultimately, software development is about productivity, high quality, predictability, and consistency. As we transfer images between development, staging, and production environments and set up the corresponding containers, we can harness Docker's advantages to expedite the software shipping process.

Referring back to our earlier discussion of the shipping industry's transformation, they increased their loading/unloading productivity by introducing standardized containers. Docker does something similar by simplifying the process of shipping code, frameworks, databases, and more across environments (and cloud providers) in much the same way.

## Installing Docker Desktop

Before diving into using Docker functionality, you'll want to install [Docker Desktop](https://www.docker.com/). Here's some information about installing and running Docker Desktop on Windows, Linux, and Mac.  
  
**Windows**  
  
To install [Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/), the following system requirements must be met.

- You need to have the WSL 2 backend (or the Hyper-V backend with Windows containers).

- For the WSL 2 backend, you should have WSL version 1.1.3.0 or above, and you must be running Windows 11 64-bit (Home/Pro version 21H2 or higher) or Windows 10 64-bit (Home/Pro 21H2 or higher).

- Enable the WSL 2 feature on Windows. Hardware prerequisites for running WSL 2 include a 64-bit processor with SLAT, 4GB system RAM, and BIOS-level hardware virtualization support.

- Install the Linux kernel update package.

- Note that Docker Desktop on Windows is only supported on Windows versions within Microsoft's servicing timeline. Keep in mind that containers and images created with Docker Desktop are shared across all user accounts on the machine, except when using the Docker Desktop WSL 2 backend.

**Linux**

To install [Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/), the following system prerequisites must be met.

- Docker Desktop for Linux runs a custom docker context called "desktop-linux" and does not have access to images and containers deployed on the Linux Docker Engine before installation.

- Supported platforms include Ubuntu, Debian, and Fedora, with experimental support for Arch-based distributions.

- Docker supports the current LTS release and the most recent version of the mentioned distributions, discontinuing support for the oldest version when new versions are available.

- General system requirements for Docker Desktop on Linux include a 64-bit kernel with CPU support for virtualization, KVM virtualization support, QEMU version 5.2 or newer, systemd init system, Gnome, KDE, or MATE Desktop environment, at least 4 GB of RAM, and enabling ID mapping in user namespaces.

- Running Docker Desktop in nested virtualization scenarios is not supported by Docker, so it's recommended to run it natively on supported distributions.

**Mac**

To install [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/), the following system prerequisites must be met.

Mac with Intel chip:

- macOS version 11 (Big Sur), 12 (Monterey), or 13 (Ventura) is required, and it's recommended to have the latest macOS version.

- Docker supports the current release of macOS and the previous two releases, discontinuing support for the oldest version when new major macOS versions are available.

- At least 4 GB of RAM is required.

- VirtualBox version prior to 4.3.30 should not be installed as it is incompatible with Docker Desktop.

Mac with Apple silicon:

- Starting from Docker Desktop 4.3.0, Rosetta 2 is no longer a hard requirement, but it's recommended for the best experience. Optional command line tools may still require Rosetta 2 on Darwin/AMD64.

- To install Rosetta 2 manually from the command line, run the provided command: softwareupdate --install-rosetta

## Getting Started with Docker Commands

Once Docker Desktop is installed and the engine is running on your machine, you can open a command window and type the following command:

```bash
docker
```

This will output a list of different commands that can be run:

[![Docker commands](/images/blog/docker-for-developers-understanding-the-core-concepts/image-1024x641.png)](https://blog.codewithdan.com/wp-content/uploads/2023/06/image.png)

While a complete discussion of available commands is outside the scope of this post, here are a few core commands to know about. It's important to note that there are "management commands" that can be used as well as "core commands" in some cases. I tend to go with the core commands (old habits die hard), but some people prefer the management commands. You can learn more about the available commands at [https://docs.docker.com/engine/reference/commandline/cli/](https://docs.docker.com/engine/reference/commandline/cli/).

```bash
# Pull the nginx:alpine image from Docker Hub 
# (a place to store images) to your machine
docker pull nginx:alpine

# Build docker a docker image from a Dockerfile
docker build -t myImage:1.0 .

# List docker images on your machine
docker images

# Run a container on port 8080.
# Visit http://localhost:8080 to view it
docker run -d -p 8080:80 nginx:alpine

# List all running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop [containerId | containerName]

# Remove a container
docker rm [containerId | containerName]

# Remove an image
docker rmi [imageId]
```

Looking through the above commands, you might wonder how an image is built. Custom images are built by using a special file called a Dockerfile. Think of it as a list of instructions that determines what goes into the container that will eventually run (code, security settings, configuration, framework, and more). Here's an example of a simple Dockerfile that can be used to build a custom nginx image.

```
FROM        nginx:alpine
LABEL       author="Your Name"
WORKDIR     /usr/share/nginx/html
COPY        . /usr/share/nginx/html

# Could do "COPY . ." as well since working directory is set

EXPOSE      80
CMD         ["nginx", "-g", "daemon off;"]
```

This Dockerfile defines the latest version of nginx:alpine as the foundation to use, adds a label, sets the working directory (the directory in the container), and then copies the code from the local machine into the image (copies it to the /usr/share/nginx/html directory). Finally, it exposes port 80 in the container and runs the "nginx" command along with some command-line flags.

To build this image, you would navigate to the directory where the Dockerfile file lives (Dockerfile doesn't have an extension by default), and run the following command:

```bash
docker build -t myCustomNginx:1.0 .
```

- \-t is the tag to use which is myCustomNginx

- 1.0 represents the version of the image (it's very important to version your images)

- . represents the path to the Dockerfile used to build the image. In this example it's in the same directory where we're running the "docker build" command.

While there's a lot more to cover, you've now seen some of the core commands, seen a Dockerfile, and learned how it can be used by the **docker build** command to create a new image. Once an image is created, you can push it to a registry such as Docker Hub, Azure Container Registry, Elastic Container Registry, or others.

```bash
# Push the image to Docker Hub (the default registry)
docker push myCustomNginx:1.0
```

Someone else could then run a **docker pull myCustomNginx:1.0** to pull the image to their machine/server and then use the **docker run** command to start the container. In a production scenario, the image could be pulled into a cloud service capable of running containers such as:

- [Azure Container Instances](https://learn.microsoft.com/azure/container-instances/container-instances-overview)

- [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/overview)

- [Azure App Service](https://learn.microsoft.com/azure/app-service/quickstart-custom-container?tabs=dotnet&pivots=container-linux-vscode)

- [Azure Kubernetes Service](https://learn.microsoft.com/azure/aks/intro-kubernetes)

## Summary

In this post, you've learned what Docker is and how it simplifies the process of building, shipping, and running applications across different environments. You learned that Docker runs natively on Linux and Windows but is distinct from virtual machines, offering improved efficiency and speed.

For developers, Docker provides numerous benefits. It enables rapid setup of development environments, ensuring consistency across different machines and operating systems. Docker eliminates app conflicts by utilizing isolated containers, allowing the simultaneous execution of multiple application versions and frameworks. Additionally, Docker facilitates the seamless transfer of code and its environment between various environments, such as development, staging, and production. By leveraging Docker, you can expedite software shipping, benefiting from container isolation, consistent development environments, and improved versioning management. Drawing inspiration from the shipping industry's adoption of standardized containers, Docker revolutionizes how we ship software components, frameworks, databases, and more across diverse environments.

If you're interested in diving deeper into Docker and learning how to work with images, containers, networks, volumes, running multiple containers, and more, check out my [Docker for Web Developers course](https://app.pluralsight.com/library/courses/docker-web-development/table-of-contents) on Pluralsight.
