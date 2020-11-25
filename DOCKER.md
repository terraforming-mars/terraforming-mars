# Terraforming-mars Docker Installations

## Build a docker image and run it

Be sure to navigate to the .../terraforming-mars directory cloned from GitHub.

```bash
docker build . -t terraforming-mars
docker run -d \
--name terraforming-mars \
-p 8080:8080 \
-v tm-db:/usr/src/app/db \
terraforming-mars
```

This will start the game server listening on the default port of 8080. If you then point a web browser to http://localhost:8080 you will be on the create game screen.

## Simple docker-compose service

The file below is the standard compose file in the repository. For a simple installation, simply navigate to the “”terraforming-mars” directory created when cloning the GitHub repository and you are ready to start the container. 

If you are adding the service to another compose file, be sure the build directory (“build: ./”) and the first volume source (“- ./”) point to the directory containing the `Dockerfile` from the GitHub repository.

```yaml
version: "3.7"  
services:
  terraforming-mars:
    container_name: terraforming-mars
    build: ./
    restart: unless-stopped
    ports:
      - "8080:8080"
    security_opt:
      - no-new-privileges:true
    volumes:
      - tm-db:/usr/src/app/db
volumes:
  tm-db:
```

Start the service and run in the background

```bash
docker-compose up -d
```

## docker-compose with Traefik reverse proxy

Traefik labels formatted for Traefik v2. Build directory (“build: ./”) points to the directory containing the `Dockerfile` from the GitHub repository. 

Replace:

* t2_proxy: Your external network defined in Traefik docker-compose service
* “traefik” (depends_on) : name of your Traefik service
* https: name of desired Traefik entry point(s)
* terraforming-mars.$DOMAINNAME: desired host name for Traefik to forward to web app

```yaml
services:

######### Define Traefik service here ###########

  terraforming-mars:
    container_name: terraforming-mars
    build: ./
    restart: unless-stopped
    networks:
      - t2_proxy
    security_opt:
      - no-new-privileges:true
    depends_on:
      - "traefik"
    volumes:
      - tm-db:/usr/src/app/db
    labels:
      - "traefik.enable=true"
      ## HTTP Routers
      - "traefik.http.routers.tm-rtr.entrypoints=https"
      - "traefik.http.routers.tm-rtr.rule=Host(`terraforming-mars.$DOMAINNAME`)"
      - "traefik.http.routers.tm-rtr.tls=true"
      ## HTTP Services
      - "traefik.http.routers.tm-rtr.service=tm-svc"
      - "traefik.http.services.tm-svc.loadbalancer.server.port=8080"
volumes:
  tm-db:
```

Start the service and run in the background

```bash
docker-compose up -d
```

