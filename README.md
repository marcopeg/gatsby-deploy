# What is Gatsby Deploy?

We will see...

## Generate a deployment JWT

The JWT that we are going to generate will validate and configure the
deployment activity.

This procedure will generate a JWT that contains an **encrypted password**.
Even if this is quite safe, it is always better to generate a
**github user token** to use during deployment.

    {
        "auth":{
            "email": "marco.pegoraro@gmail.com",
            "username": "marcopeg",
            "password": "xxx"
        },
        "trigger": {
            "type": "github-hook",
            "event": "push",
            "branch": "source"
        },
        "origin": {
            "type": "github",
            "repository": "marcopeg/hello-world",
            "branch": "source",
            "build": "public"
        },
        "target": {
            "type": "github",
            "repository": "marcopeg/hello-world",
            "branch": "master"
        },
        "build": {
            "script": "build",
            "target": "public"
        }
    }

Use [jwt.io](https://jwt.io) to generate a valid JWT, setting up the correct
jwt secret that is used by your deployment instance.

> This is needed to veryfy the genuinity of your request

Copy the JWT and navigate to:

    https://deployment.instance.com/encrypt?token=xxx

This utility will finally produce a JWT that you can use to setup your webhook

    https://deployment.instance.com/build?token=xxx

## Matching GitHub Events

The deploy script does some attempts to reject webhooks that don't match the
expected `origin.branch` or the optional `origin.event` name.

Branches are correctly identified for pushes, pull requests and releases.

We support any GitHub webook event names, plus we add some logic to detect custom
events:

- pull_request_merged
- pull_request_rejected



