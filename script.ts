
import { CreateGameForm } from "./src/components/CreateGameForm";
import { GameHome } from "./src/components/GameHome";
import { PlayerHome } from "./src/components/PlayerHome";

import Vue from "vue";

const app = new Vue({
    el: "#app",
    data: {
        screen: "empty",
        playerkey: 0,
        game: {
            players: []
        }
    },
    components: {
        "create-game-form": CreateGameForm,
        "game-home": GameHome,
        "player-home": PlayerHome
    },
    mounted: function () {
        if (window.location.pathname === "/player") {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/player" + window.location.search);
            xhr.onerror = function () {
                alert("Error getting game data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    window.history.replaceState(xhr.response, "Teraforming Mars - Player", "/player?id=" + xhr.response.id);
                    app.$data.player = xhr.response;
                    this.$data.screen = "player-home";
                } else {
                    alert("Unexpected server response");
                }
            }
            xhr.responseType = "json";
            xhr.send();
        } else if (window.location.pathname === "/game") {
            this.$data.screen = "game-home";
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/game" + window.location.search);
            xhr.onerror = function () {
                alert("Error getting game data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    window.history.replaceState(xhr.response, "Teraforming Mars - Game", "/game?id=" + xhr.response.id);
                    app.$data.game = xhr.response;
                } else {
                    alert("Unexpected server response");
                }
            }
            xhr.responseType = "json";
            xhr.send();
        } else {
            this.$data.screen = "create";
        }
    }
});

