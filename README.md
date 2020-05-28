# terraforming-mars

Terraforming Mars Boardgame

The board game is great, this repository highly recommends purchasing [it](https://www.amazon.com/Stronghold-Games-6005SG-Terraforming-Board/dp/B01GSYA4K2) for personal use. If you want to play with people online, you can use this tool.

## Demo

You can try online [here](https://terraforming-mars.herokuapp.com/). Please post any issues found. If you plan on playing long running games it is recommended to host the game locally. This demo site is currently not stable and gets restarted during each push to `master`. As this repository is gaining in popularity we attempt to make this demo page stable but it can't be guaranteed that your game will not be lost. Running the game locally will always be straight forward and it is highly recommended to host the game locally and provide the server ip to other players.

## Running

You can run the game server locally if you have `npm` and `node`. To start the game server run the `start` script.

```
npm install
npm run start
```

This will start the game server listening on the default port of 8080. If you then point a web browser to http://localhost:8080 you will be on the create game screen.

Pointing your web browser to http://localhost:8080/games-overview?serverId=_SERVER-ID_ will provide a list of all games available on the server. The secret _SERVER-ID_ is available from the console after starting the server and required to access game administration pages like the games overview.

### docker

Build the docker image and run it

```
docker build . -t terraforming-mars
docker run -p 8080:8080 terraforming-mars
```

This will start the game server listening on the default port of 8080. If you then point a web browser to http://localhost:8080 you will be on the create game screen.

### docker-compose

If traefik and watchtower are running on your docker host, you can use the docker-compose.yml template of this repo.

It is starting the game from a public image hosted on hub.docker.com

```
terraforming-mars:
  image: lotooo/terraforming-mars
  container_name: terraforming-mars
  labels:
    - "traefik.frontend.rule=Host:terraforming-mars.mydomain.com"
    - "traefik.port=8080"
    - "traefik.protocol=http"
    - "traefik.backend=terraforming-mars"
    - "com.centurylinklabs.watchtower.enable=true"
```

Start the service

```
docker-compose up
```

This will start the game server. If you then point a web browser to https://terraforming-mars.mydomain.com you will be on the create game screen.

### docker-compose + systemd

Copy your docker-compose file in a /data/docker/terraforming-mars folder, then create a systemd unit to stop/start/restart your service

Create a  file `/lib/systemd/system/terraforming-mars.service` with this content:

```
[Unit]
Description=Terraforming Mars service with docker compose
Requires=docker.service
After=docker.service

[Service]
Restart=always
WorkingDirectory=/data/docker/terraforming-mars

# Remove old containers, images and volumes
ExecStartPre=/usr/bin/docker-compose down -v
ExecStartPre=/usr/bin/docker-compose rm -fv
ExecStartPre=-/bin/bash -c 'docker ps -aqf "name=terraforming-mars*" | xargs -r docker rm'

# Compose up
ExecStart=/usr/bin/docker-compose up

# Compose down, remove containers and volumes
ExecStop=/usr/bin/docker-compose down -v

[Install]
WantedBy=multi-user.target
```

Reload systemd + enable and start terraforming mars

```
sudo systemctl daemon-reload
sudo systemctl enable terraforming-mars.service
sudo systemctl start terraforming-mars.service
```



## Contributors ✨

Thanks goes to these wonderful people:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bafolts"><img src="https://avatars1.githubusercontent.com/u/2707843?v=3" width="100px;" alt=""/><br />
        <sub><b>Brian Folts</b></sub><br />All the things</a>
    </td>
    <td align="center">
      <a href="https://github.com/vincentneko"><img src="https://avatars1.githubusercontent.com/u/56086992?v=3" width="100px;" alt=""/><br />
        <sub><b>Vincent Moreau</b></sub><br />Venus, Prelude, Hellas & Elysium, Colonies</a>
    </td>
    <td align="center">
      <a href="https://github.com/alrusdi"><img src="https://avatars2.githubusercontent.com/u/394311?v=3" width="100px;" alt=""/><br />
        <sub><b>alrusdi</b></sub><br />Front End</a>
    </td>
    <td align="center">
      <a href="https://github.com/ssimeonoff"><img src="https://avatars3.githubusercontent.com/u/6917565?s=460&v=4" width="100px;" alt=""/><br />
        <sub><b>Simeon Simeonov</b></sub><br />Cards and Colonies design</a>
    </td>
    <td align="center">
      <a href="https://github.com/pierrehilbert"><img src="https://avatars0.githubusercontent.com/u/806950?v=3" width="100px;" alt=""/><br />
        <sub><b>Pierre HILBERT</b></sub><br />Helps with the things</a>
    </td>
  </tr>
</table>
