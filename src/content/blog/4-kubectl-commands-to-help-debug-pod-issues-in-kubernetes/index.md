---
title: "4 kubectl Commands to Help Debug Pod Issues in Kubernetes"
date: 2019-04-14
categories: 
  - "docker"
  - "kubernetes"
tags: 
  - "commands"
  - "containers"
  - "debug"
  - "diagnose"
  - "kubectl"
  - "pods"
coverImage: "2019-03-10_16-06-42.png"
---

<figure>

![mac command by Hannah Joshua](/images/blog/4-kubectl-commands-to-help-debug-pod-issues-in-kubernetes/46T6nVjRc2w.webp)

<figcaption>

mac command by Hannah Joshua

</figcaption>

</figure>

![](/images/blog/4-kubectl-commands-to-help-debug-pod-issues-in-kubernetes/2019-03-10_16-06-42.webp)If you've worked with containers a lot you're probably good at commands like **docker logs** and **docker exec** to retrieve information about containers that may be having problems. One of the challenges that comes up as people move to Kubernetes is understanding how to get similar details about Pods and any containers running within them. I've had several people ask me about this recently in my instructor-led [Kubernetes course](https://codewithdan.com/products/docker-kubernetes) as well as online with my [Docker for Web Developers](https://app.pluralsight.com/library/courses/docker-web-development/table-of-contents) course (which has a module on Kubernetes) so I decided to post a few of the initial commands you can use to get started resolving Pod and container issues.

## Checking Pod Logs with kubectl logs

The first thing I normally do if a Pod is having problems is check the logs for any errors. This is very similar to **docker logs**.

```bash
kubectl logs [pod-name]
```

If the Pod contains more than one container you can use the **\-c** switch to define a specific container. Use the container name defined in the Pod or Deployment YAML.

```bash
kubectl logs [pod-name] -c [container-name]
```

Note: Run **kubectl get pod \[pod-name\] -o yaml** or **kubectl get deployment \[deployment-name\] -o yaml** if you're not sure about the name of the container. The **\-o yaml** switch is useful for getting additional information about the Pod by the way - more information on that technique will be provided a little later.

To get logs for all containers in a Pod (if you have more than 1) you can run the following:

```bash
kubectl logs [pod-name] --all-containers=true
```

If you want to get logs for a previously running Pod add the **\-p** flag:

```bash
kubectl logs -p [pod-name]
```

Finally, to stream the logs for a Pod use the **\-f** flag:

```bash
kubectl logs -f [pod-name]
```

[kubectl logs documentation](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)

## Describing a Pod with kubectl describe

You can run the **kubectl describe** command to see information about the Pod as well as events that have run (look at the bottom of the output for the events). This is really helpful to see if the image for a container was pulled correctly, if the container started in the Pod, any Pod reschedule events, and much more.

```bash
kubectl describe pod [pod-name]
```

In some cases describe events may lead to the discovery that the troubled Pod has been rescheduled frequently by Kubernetes. It's great that this happens (when setup properly with a Deployment for example), but it's also good to get to the bottom of "why" a Pod is being rescheduled to determine if there's a bug in the code that's running, a memory leak, or another issue.

[kubectl describe documentation](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe)

## Viewing the Pod YAML with -o yaml

Finally, you can run **kubectl get** on a troubled Pod but display the YAML (or JSON) instead of just the basic Pod information. In many scenarios this may yield some useful information.

```bash
kubectl get pods [pod-name] -o yaml
```

You can do the same thing for a specific Deployment as well:

```bash
kubectl get deployment [deployment-name] -o yaml
```

[kubectl get documentation](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get)

## Shelling into a Pod Container with kubectl exec

In some cases you may need to get into a Pod's container to discover what is wrong. With Docker you would use the **docker exec** command. Kubernetes is similar:

```bash
kubectl exec [pod-name] -it -- sh
```

[kubectl exec documentation](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec)

Running one of these commands will help provide some initial information about what may be going on with a troubled Pod/Container. There are of course many other techniques that can be used as well to diagnose Pod issues (checking the UI Dashboard, monitoring, viewing stats about containers, and much more), but these should help get you started if you're new to Kubernetes.

[Discuss on Twitter](https://twitter.com/search?q=https%3A%2F%2Fblog.codewithdan.com%2F4-kubectl-commands-to-help-debug-pod-issues-in-kubernetes%2F&src=typd)
