---
title: "Docker Volumes and \"print working directory\" Command Syntax"
date: 2019-03-29
categories: 
  - "docker"
---

[![](/images/blog/docker-volumes-and-print-working-directory-pwd/docker_logo.webp)](https://blog.codewithdan.com/wp-content/uploads/2017/10/docker_logo.png)I often use Docker to run an application in a container as I'm writing and testing code. That involves creating a volume that points the container to a path on my machine. The challenge with setting up volumes is that the "print working directory" command that is often used to easily identify the location of your source code on the host machine is different depending on what command terminal you're using (especially on Windows).

Here's a quick summary that shows the syntax for "print working directory" in different command terminals when using volumes (if you're new to volumes you can [read more about them here](https://docs.docker.com/engine/admin/volumes/volumes/)). An [nginx container](https://hub.docker.com/_/nginx/) path is shown to provide a simple example of a volume pointing to the current working directory on the host machine.

## Windows Command Window Syntax

You can use the %cd% syntax to represent the current working directory:

```bash
 -v %cd%:/usr/share/nginx/html
```

## PowerShell Command Window Syntax

You can use the ${PWD} syntax to represent the current working directory:

```bash
 -v ${PWD}:/usr/share/nginx/html
```

## Windows Subsystem for Linux (WSL) with a Windows Directory Syntax

If you're referencing a Windows directory from WSL2 you can use the following syntax.  
**NOTE:** It's recommended you reference a directory that is within WSL rather than within Windows for performance reasons.  

```bash
-v /mnt/c/username/some-windows-directory:/usr/share/nginx/html
```

## Git Bash on Windows Syntax

You can use the /$(pwd) syntax to represent the current working directory:

```bash
-v /$(pwd):/usr/share/nginx/html
```

## Mac/Linux Syntax

You can use $(pwd) syntax to represent the current working directory:

```bash
-v $(pwd):/usr/share/nginx/html
```

There are additional variations of the "print working directory" syntax shown above. If you prefer to use a different one please leave a comment with the information - share the knowledge!

[Discuss on Twitter](https://twitter.com/search?src=typd&q=https%3A%2F%2Fblog.codewithdan.com%2Fdocker-volumes-and-print-working-directory-pwd%2F)
