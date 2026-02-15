---
title: "Error Installing Deno on Windows 11 using PowerShell 7.2 (and how I got it working)"
date: 2022-01-03
categories: 
  - "deno"
tags: 
  - "error"
  - "installation"
  - "powershell"
  - "windows11"
coverImage: "Deno-Install-Error.webp"
---

I've been playing around with [Deno](https://deno.land/) lately and wanted to get it installed on a new Windows 11 laptop I bought. To install Deno, you can go to the [https://deno.land/#installation](https://deno.land/#installation) page and follow the instruction for your operating system. I'm currently using Powershell 7.2 so I tried the command that was suggested since it's normally a quick and easy install:

```powershell
iwr https://deno.land/install.ps1 -useb | iex
```

That led to the following error:

```powershell
SetValueInvocationException: Exception setting "SecurityProtocol": "The requested security protocol is not supported."
```

After reading a [few posts](https://stackoverflow.com/a/48030563) and an [issue on Github](https://github.com/denoland/deno_install/issues/191#issuecomment-915993531) the suggested fix looked to be the following. But, that didn't work for me:

```powershell
[Net.ServicePointManager]::SecurityProtocol = "tls12, tls11, tls"
```

After scanning the [Github issue](https://github.com/denoland/deno_install/issues/191#issuecomment-915993531) more, I finally found a curl command that ended up working correctly with PowerShell. Problem solved (finally)!

```powershell
curl.exe -fsSL https://deno.land/x/install/install.ps1 | out-string | iex
```

Hopefully this helps someone else who gets stuck on the issue. If anyone knows why the _SecurityProtocol_ command didn't fix it, please leave a comment. I'd be interested in knowing how to get the _iwr_ working correctly since that's the default suggestion on the Deno installation page.
