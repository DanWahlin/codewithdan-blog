---
title: "Enabling Metrics Server for Kubernetes on Docker Desktop"
date: 2020-02-17
categories: 
  - "docker"
  - "kubernetes"
tags: 
  - "docker"
  - "kubernetes"
  - "metricsserver"
coverImage: "2019-03-10_16-06-42.png"
---

![](/images/blog/enabling-metrics-server-for-kubernetes-on-docker-desktop/2019-03-10_15-40-57-1.png)

Lately we've been working on a new [Docker and Kubernetes](https://codewithdan.com/products/docker-kubernetes) instructor-led training class that we'll be running onsite at several companies this year. The class uses [Docker Desktop](https://www.docker.com/products/docker-desktop) and the [Kubernetes](https://kubernetes.io) features it provides for several of the chapters. We needed to get the local cluster students will use to match as closely as possible to a cloud-based Kubernetes cluster that would be found on Azure, AWS, or GCP. The class covers using AKS as well, but most of the lab exercises rely on Kubernetes in Docker Desktop so running key features like the dashboard and Metrics API was important.

The majority of the Kubernetes functionality on Docker Desktop works great out of the box. You can run standard **kubectl** commands, work with various **Service types** including LoadBalancer (it supports localhost), run **Deployments** (against a single Node), and more, but getting **kubectl top** commands to work was challenging.

It turns out that Metrics Server isn't installed by default with Docker Desktop. You do get it automatically if you install Kubernetes using **kube-up.sh**. To work around that, we installed **Metrics Server** by following the directions at [https://github.com/kubernetes-incubator/metrics-server#deployment](https://github.com/kubernetes-incubator/metrics-server#deployment), but running **kubectl top** commands resulted in "no metrics available" messages. Definitely frustrating.

By running **kubectl logs \[metrics-server-pod-name\] -n kube-system** we could see that the Pod/Container was there, but it looked like some unexpected issues were coming up.

After doing some research (translated: Google Fu), I came across a [Github issue](https://github.com/docker/for-mac/issues/2751#issuecomment-441833752) that seemed to solve the problem and enabled the **kubectl top** command to start reporting information about Nodes and Pods on Docker Desktop/Kubernetes. Here are the steps that fixed the issue.

## Enabling Metrics Server in Docker Desktop

1\. Clone or download the [Metrics Server project](https://github.com/kubernetes-incubator/metrics-server).

2\. Open the **deploy/kubernetes/metrics-server-deployment.yaml** file in an editor.

3\. Add the **\--kubelet-insecure-tls** argument into the existing **args** section. That section will look like the following once you're done:

```yaml
args:
  - --cert-dir=/tmp
  - --secure-port=4443
  - --kubelet-insecure-tls
```

NOTE: **DO NOT enable kubelet-insecure-tls on a cluster** **that will be accessed externally**. This is only being done for a local Docker Desktop cluster.

4\. Run the following command as shown on the [Metrics Server repo](https://github.com/kubernetes-incubator/metrics-server) to create the deployment, services, etc.

```bash
kubectl create -f deploy/kubernetes
```

5\. To see how things are going, first get the name of your Metrics Server Pod by running the following command:

```bash
kubectl get pods -n kube-system
```

6\. Now run the following command and the logs should show it starting up and the API being exposed successfully:

```bash
kubectl logs [metrics-server-pod-name] -n kube-system
```

7\. Give it a little time and you should now be able to run **kubectl top** commands!

![View of kubectl node command.](/images/blog/enabling-metrics-server-for-kubernetes-on-docker-desktop/2019-03-10_15-32-44.png)

![](/images/blog/enabling-metrics-server-for-kubernetes-on-docker-desktop/2019-03-10_15-40-57.png)

There are almost always multiple ways to accomplish the same goal so if you know of an alternate technique for getting Metrics Server going on Docker Desktop Kubernetes please leave a comment!

I'm hoping that at some point this functionality will ship directly in Docker Desktop, but for now you have to install it to get it running.

[Discuss on Twitter](https://twitter.com/search?q=https%3A%2F%2Fblog.codewithdan.com%2Fenabling-metrics-server-for-kubernetes-on-docker-desktop%2F&src=typd)
