# Terraforming-mars

This is an open-source online implementation of the great board game Terraforming mars. **It is not affiliated
with FryxGames, Asmodee Digital or Steam in any way.**

**Terraforming Mars Board Game**

The board game is great and this repository highly recommends purchasing [it](https://www.amazon.com/Stronghold-Games-6005SG-Terraforming-Board/dp/B01GSYA4K2) for personal use.

Join us on Discord [here](https://discord.gg/fWXE53K).

## Demo

You can demo this web app online [here](https://terraforming-mars.herokuapp.com/). If you find a bug or have a feature request, please add it as one in issues tab. If you plan on playing long-running games, it is recommended that you host the game locally. This demo site is currently not stable and gets restarted during each push to `main`. A multiplayer game will remain available for 10 days, after which it will be flushed from the database. Unfinished solo games are flushed after one day. As this repository is gaining in popularity, we will attempt to make this demo page stable but cannot guarantee that your game will not be lost. It is highly recommended to host the game locally, and it's dead simple: run `npm install` and then `npm run start`.

## Docker Hub Image Game Server Running

Docker Hub image is made for users who difficulty to Vist the Demo website.
You can build game server easily. 
1. Search terraforming-mars docker image on you NAS(eg:QNAP or Synology) or other container. You can find [ltdstudio/terraforming-mars].
2. Build it when you downloaded docker Image.
3. Run it. It will start the game server listening on the Host port of 8080.
Docker Image homepage is: https://hub.docker.com/r/ltdstudio/terraforming-mars

## Windows or Linux Game Server Running

You can run the game server locally if you have `npm` and `node`. To start the game server run the `start` script.

```
npm install
npm run build
npm run start
```

This will start the game server listening on the default port of 8080. If you then point a web browser to http://localhost:8080 you will be on the create game screen. To change this port from 8080, add `PORT=<new port>` in your `.env` file. 

Pointing your web browser to http://localhost:8080/games-overview?serverId=_SERVER-ID_ will provide a list of all games available on the server. The secret _SERVER-ID_ is available from the console after starting the server and required to access game administration pages like the games overview.

### Local Setup

Additional information on how to setup the game server locally can be found [here](https://docs.google.com/document/d/1r4GlqA6DkrSAtR6MMYmX_nmh6o4igVTqDUUETiJYGt8/edit?usp=sharing) (short version) and [here](https://docs.google.com/document/d/1y-QnffzkQtpasBkDAFQwBoqhLmUpVTzRPybtvmbktDQ/edit?usp=sharing) (detailed version).

#### dotenv

A [.env](https://www.npmjs.com/package/dotenv) file allows you to store environmental variables like `PORT=443`. The following are supported **and are optional**:

* `PORT`: (default 8080) Which port to use for this server
* `HOST`: What hostname to use
* `CERT_PATH`: Your TLS certificate path (=> `fullchain.pem` created by certbot)
* `KEY_PATH`: Your TLS private key path (=> `privkey.pem` created by certbot)
* `MAX_GAME_DAYS`: How many days to keep unfinished games before deleting them
* `WAITING_FOR_TIMEOUT`: (default 5000) How many milliseconds to check for game update on multi-player games
* `ASSET_CACHE_MAX_AGE`: (default 0) How many seconds should assets (fonts, stylesheets, images) be cached by browsers
* `SERVER_ID`: (default random) Static pass phrase to restrict access to /games-overview and /api/games endpoints
* `LOCAL_FS_DB`: When non-empty, stores game states in JSON files. Good for local development and debugging, bad for hosting lots of games.

A `.env.sample` file can be used as a template. You can rename it to `.env` and it will take effect in your environment. Note that `.env` is ignored in source control.

### Deployment

If you are looking for a dead simple deployment, use Heroku, instructions are are on the [wiki](../../wiki/Heroku-Setup). For Docker, read below.

#### Docker

Additional information on how to setup the game with Docker can be found [here](DOCKER.md).

#### HTTPS

To set up an HTTPS sub/domain for use with this project, set the paths for `KEY_PATH` and `CERT_PATH` in your `.env`. If you do not have a TLS cert/key for your domain, you can get one for free from [certbot](https://certbot.eff.org/).

## ✨ Contributors ✨

Thanks goes to these wonderful people:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bafolts"><img src="https://avatars1.githubusercontent.com/u/2707843?v=3" width="100px;" alt=""/><br />
        <sub><b>Brian Folts</b></sub><br />All the things</a>
    </td>
    <td align="center">
      <a href="https://github.com/vincentneko"><img src="https://avatars1.githubusercontent.com/u/56086992?v=3" width="100px;" alt=""/><br />
        <sub><b>Vincent Moreau</b></sub><br />Venus, Prelude, Hellas & Elysium, Colonies, Turmoil</a>
    </td>
    <td align="center">
      <a href="https://github.com/alrusdi"><img src="https://avatars2.githubusercontent.com/u/394311?v=3" width="100px;" alt=""/><br />
        <sub><b>alrusdi</b></sub><br />Front End</a>
    </td>
    <td align="center">
      <a href="https://github.com/ssimeonoff"><img src="https://avatars3.githubusercontent.com/u/6917565?s=460&v=4" width="100px;" alt=""/><br />
        <sub><b>Simeon Simeonov</b></sub><br />UX, cards and Colonies design</a>
    </td>
    <td align="center">
      <a href="https://github.com/pierrehilbert"><img src="https://avatars0.githubusercontent.com/u/806950?v=3" width="100px;" alt=""/><br />
        <sub><b>Pierre Hilbert</b></sub><br />Turmoil and helps with the things</a>
    </td>
    <td align="center">
      <a href="https://github.com/nwai90"><img src="https://avatars1.githubusercontent.com/u/2408094?s=460&v=4" width="100px;" alt=""/><br />
        <sub><b>nwai90</b></sub><br />Helps with the things</a>
    </td>
    <td align="center">
      <a href="https://github.com/pocc"><img src="https://avatars1.githubusercontent.com/u/10995145?s=460&v=4" width="100px;" alt=""/><br />
        <sub><b>Pocc</b></sub><br />He did that one thing one time</a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/kberg"><img src="https://avatars1.githubusercontent.com/u/413481?s=460&v=4" width="100px;" alt=""/><br />
        <sub><b>Robert Konigsberg</b></sub><br />Ares fan expansion, infrastructure cleanup, code reviews, two opinions too many.</a>
    </td>    
  </tr>
</table>


## LICENSE

GPLv3
