---
title: "Using the Docker &quot;before&quot; Filter to Remove Multiple Images"
date: 2020-01-14
categories: 
  - "docker"
tags: 
  - "batch"
  - "filter"
  - "images"
  - "remove"
coverImage: "docker_logo.png"
---

![](/images/blog/using-the-docker-before-filter-to-remove-multiple-images/docker_logo.png)

I recently needed to cleanup a bunch of old Docker images on a VM that I run in Azure. While I could remove each image one by one using the standard **docker rmi \[IMAGE IDS\]** command, removing multiple images all at once as a batch was preferable.

It turns out that removing a specific range of images is fairly straightforward using the [**"before"** filter](https://docs.docker.com/engine/reference/commandline/images/#options). You can do the following to list all images that exist before a particular image:

```bash
docker images danwahlin/nginx-codelabs -f "before=danwahlin/nginx-codelabs:1.15"
```

Running the command will show all of the images that existed before the **danwahlin/nginx-codelabs:1.15** image (basically the older images). Once you run the command and confirm that the correct images are showing, you can remove all of them in a batch using the following command:

```bash
docker images danwahlin/nginx-codelabs -f "before=danwahlin/nginx-codelabs:1.15" -q | xargs docker rmi
```

Note that the **\-q** switch located toward the end of the command is used to only list the IDs for each image. These IDs are then piped into the **docker rmi** command and removed as a batch.

Nice and easy!

## Obligatory Disclaimer

It goes without saying that you'll want to use caution if you're doing something like this on a machine that is considered "critical". Double and triple check that the correct image IDs are being returned using the first command above. The good news is images associated with an existing container will display an error and not be removed (you'd have to force the removal using docker rmi -f). Plus, you can always pull missing images again from your registry. To sum it up - don't do something stupid that you'll regret later! :-)
