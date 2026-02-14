---
title: "Installing MongoDB on Mac Catalina using Homebrew"
date: 2020-01-10
categories: 
  - "mongodb"
tags: 
  - "security"
  - "troubleshooting"
coverImage: "mongodb.png"
---

![](/images/blog/installing-mongodb-on-mac-catalina-using-homebrew/mongodb.webp)

I recently bought a new iMac and moved all of my files over using Time Machine. The migration went really well overall and within a few hours I had my development machine up and running. After starting an application I'm building I quickly realized that I couldn't get MongoDB to start. Running the following command resulted in an error about the **data/db** directory being read-only:

```bash
mongod --auth
```

I tried every **chmod** and **chown** command known to man and woman kind, tried manually changing security in Finder, compared security to my other iMac (they were the same), and tried a bunch of other things as well. But, try as I might I still saw the read-only folder error when trying to start the server....very frustrating. I found a lot of posts with the same issue but they all solved it by changing security on the folder. That wasn't the problem on my machine.

After doing more research I found out that Catalina added a new volume to the hard drive and creates a special folder where the MongoDB files need to go. The new folder is:

```bash
/System/Volumes/Data
```

The MongoDB files can then go at:

```bash
/System/Volumes/Data/data/db
```

I ran the following commands to install the latest version of MongoDB using [Homebrew](https://brew.sh/) (see [https://github.com/mongodb/homebrew-brew](https://github.com/mongodb/homebrew-brew) for more details):

```bash
brew tap mongodb/brew
brew install mongodb-community
```

I then went into the MongoDB config file at **/usr/local/etc/mongod.conf**. Note that it's possible yours may be located in a different location based on how you installed MongoDB. I changed the **dbPath** value to the following and copied my existing DB files into the folder:

```json
dbPath: /System/Volumes/Data/data/db
```

Finally, I made sure my account had the proper access to the folder by running **chown** (something I had tried many times earlier but on a folder outside of /System/Volumes/Data):

```bash
sudo chown -R $USER /System/Volumes/Data/data/db
```

After that I was able to start MongoDB and everything was back to normal. Hopefully this saves someone a few hours - I wasted way too much time on the issue. :-)
