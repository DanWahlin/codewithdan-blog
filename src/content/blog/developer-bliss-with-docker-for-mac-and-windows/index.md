---
title: "Developer Bliss with Docker for Mac & Docker for Windows"
date: 2016-06-20
categories: 
  - "docker"
coverImage: "docker-logo-240.png"
---

![docker-logo-240](/images/blog/developer-bliss-with-docker-for-mac-and-windows/docker-logo-240.webp)I'm a huge fan of [Docker](https://www.docker.com/) and am using it a lot in various projects now. In fact the [https://blog.codewithdan.com](https://blog.codewithdan.com) site is running in Docker containers on [Azure](https://azure.microsoft.com). Three containers are used and managed with [Docker Cloud](https://cloud.docker.com/_/dashboard/onboarding):

1. nginx container
2. Wordpress container
3. MariaDB (MySql) container

What's great about Docker is that I can have a local version of my blog up and running on my dev machine in a matter of minutes and it mirrors production. That makes it easy to test out various Wordpress changes (plugin and theme updates for example) rather than trying them on my production server which can be scary! If you're working in an enterprise environment this capability is especially useful with Line of Business apps that may require a lot of moving parts such as a reverse proxy, one of more running web servers, databases, caching servers, etc.

If you're new to Docker, getting started with it has always been pretty straightforward using [Docker Toolbox](https://www.docker.com/products/docker-toolbox), but with [Docker for Mac](https://docker.com/getdocker) and [Docker for Windows](https://docker.com/getdocker) getting started with Docker is even easier now! With Docker Toolbox you have to use Docker Machine to get VirtualBox up and running and "linked" into a command window on Mac or Windows. That's fairly easy to do actually but does require more upfront work (albeit minimal). With Docker for Mac and Docker for Windows it's even easier and also more efficient to run on your dev box.

### Key Benefits of Docker for Mac and Docker for Windows

Docker for Mac and Docker for Windows provide several key benefits especially to developers using Docker in their workflow:

- Faster and more efficient (more native and lightweight compared to VirtualBox)
- OS level integration that leverages native networking, virtualization and file system features
- Use the localhost network to access containers
- Auto-update as new releases come out
- Run Docker commands from any command-line window
- File change notifications (used with volumes) work consistently (which is great for devs using containers to do local development)

Both the Mac and Windows apps use OS-optimized virtualization services including xhyve on Mac and Hyper-V on Windows. You won't have to worry about using Docker Machine to setup the environment (as mentioned earlier) but can still use standard Docker Client commands as well as Docker Compose commands in any command window. You can also easily restart the VM and configure it (CPUs, memory, etc.) by clicking on the icon in the toolbar on Mac or tray on Windows:

### Docker for Mac

[![dockerMac](/images/blog/developer-bliss-with-docker-for-mac-and-windows/dockerMac.webp)](https://blog.codewithdan.com/wp-content/uploads/2016/06/dockerMac.png)

 

### Docker for Windows

[![dockerWindows](/images/blog/developer-bliss-with-docker-for-mac-and-windows/dockerWindows.webp)](https://blog.codewithdan.com/wp-content/uploads/2016/06/dockerWindows.png)

 

On Mac you can go to **Preferences** to set the number of CPUs and amount of memory you'd like the underlying VM use:

[![dockerMacPrefs](/images/blog/developer-bliss-with-docker-for-mac-and-windows/dockerMacPrefs.webp)](https://blog.codewithdan.com/wp-content/uploads/2016/06/dockerMacPrefs.png)

 

Windows provides a **Settings** option:

[![dockerWindowsPrefs](/images/blog/developer-bliss-with-docker-for-mac-and-windows/dockerWindowsPrefs.webp)](https://blog.codewithdan.com/wp-content/uploads/2016/06/dockerWindowsPrefs.png)

 

[Docker for Mac](https://docker.com/getdocker) and [Docker for Windows](https://docker.com/getdocker) make it even easier to get started using Docker on your development machine.  Since it's lightweight and fast I have it setup to automatically start as I login and keep it up and running on my machine. What's really nice is that once it's installed on your dev box you can open a command window and use Docker directly without any additional configuration:

[](https://blog.codewithdan.com/wp-content/uploads/2016/06/dockerExample.png)[![dockerExample](/images/blog/developer-bliss-with-docker-for-mac-and-windows/dockerExample-1024x427.webp)](https://blog.codewithdan.com/wp-content/uploads/2016/06/dockerExample.png)

If you haven't looked into Docker yet, there's no time like the present. Once you understand how it works you'll find that it's quite amazing and great to add into your development workflow (definitely my favorite technology over the past few years). If you'd like to learn more about Docker from a developer standpoint check out my [Docker for Web Developers](https://app.pluralsight.com/library/courses/docker-web-development/table-of-contents) course on Pluralsight!

[![dockerForWebDevs](/images/blog/developer-bliss-with-docker-for-mac-and-windows/dockerForWebDevs.webp)](https://app.pluralsight.com/library/courses/docker-web-development/table-of-contents)
