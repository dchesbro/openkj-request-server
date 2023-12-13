# 🎤 OpenKJ Request Server

A self-hosted Node.js request server for use with OpenKJ.

## What does OpenKJ Request Server do?
OpenKJ Request Server provides a modern web-based interface for karaoke hosts 
using the OpenKJ karaoke hosting software. Singers can browse and search your 
songbook, submit song requests, and save their favorite songs for later.

OpenKJ Request Server is based the on original PHP 
[StandaloneRequestServer](https://github.com/OpenKJ/StandaloneRequestServer) 
developed by @ILightburn -- rest in peace and thank you for all your hard work!


## Why did you build OpenKJ Request Server?
Because I enjoy karaoke and wanted to give something back, both to the community 
at large and specifically to all those who have contributed their effort to 
creating really great tools for hosts and singers alike.

## How can I use OpenKJ Request Server?
The easiest way to deploy Bashdoard is by using Docker:

```
docker run --name openkj-request-server -e OKJRS_VENUE=Fun Karaoke Bar -p 80:3300 ghcr.io/dchesbro/openkj-request-server:main
```

Or Docker Compose:

```
openkj-request-server:
  container_name: openkj-request-server
  environment:
    - OKJRS_VENUE=Fun Karaoke Bar
  image: ghcr.io/dchesbro/openkj-request-server:main
  ports:
    - 80:3300
  restart: unless-stopped
```
