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
            "email": "xxx",
            "username": "xxx",
            "password": "xxx"
        },
        "origin": {
            "repository": "marcopeg/hello-world",
            "branch": "source",
            "build": "public"
        },
        "target": {
            "repository": "marcopeg/hello-world",
            "branch": "master"
        }
    }

Use [jwt.io](https://jwt.io) to generate a valid JWT, setting up the correct
jwt secret that is used by your deployment instance.

> This is needed to veryfy the genuinity of your request

Copy the JWT and navigate to:

    https://deployment.instance.com/encrypt?token=xxx

This utility will finally produce a JWT that you can use to setup your webhook

    https://deployment.instance.com/build?token=xxx

