
import { CreateGameForm } from "./src/components/CreateGameForm";
import { GameHome } from "./src/components/GameHome";
import { GamesOverview } from "./src/components/GamesOverview";
import { PlayerHome } from "./src/components/PlayerHome";

import Vue from "vue";
import { GameEnd } from "./src/components/GameEnd";

function trimEmptyTextNodes (el: any) {
    for (let node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.data.trim() === '') {
        node.remove()
        }
    }
}
  
Vue.directive('trim-whitespace', {
    inserted: trimEmptyTextNodes,
    componentUpdated: trimEmptyTextNodes
});

const app = new Vue({
    el: "#app",
    data: {
        screen: "empty",
        playerkey: 0,
        otherPlayersVisibility: {},
        game: {
            players: []
        }
    },
    components: {
        "create-game-form": CreateGameForm,
        "game-home": GameHome,
        "player-home": PlayerHome,
        "player-end": GameEnd,
        "games-overview": GamesOverview
    },
    methods: {
        setOtherPlayerVisibility: function(playerId: string, isVisible: boolean) {
            if (isVisible === this.getOtherPlayerVisibility(playerId)) return;
            (this as any).otherPlayersVisibility[playerId] = isVisible
            this.playerkey++;
        },
        getOtherPlayerVisibility: function(playerId: string): boolean {
            return (this as any).otherPlayersVisibility[playerId] ? true : false;
        },
        updatePlayer: function() {
            const currentPathname: string = window.location.pathname;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/player" + window.location.search);
            xhr.onerror = function () {
                alert("Error getting game data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    app.$data.player = xhr.response;
                    app.playerkey ++;
                    if (app.$data.player.phase == "end") {
                        app.$data.screen = "the-end";
                        if (currentPathname != "/the-end") {
                            window.history.replaceState(xhr.response, "Teraforming Mars - Player", "/the-end?id=" + xhr.response.id);
                        }
                    } else {
                        app.$data.screen = "player-home";
                        if (currentPathname != "/player") {
                            window.history.replaceState(xhr.response, "Teraforming Mars - Game", "/player?id=" + xhr.response.id);
                        }
                    }
                } else {
                    alert("Unexpected server response");
                }
            }
            xhr.responseType = "json";
            xhr.send();
        }
    }, 
    mounted: function () {
        const currentPathname: string = window.location.pathname;
        if (currentPathname === "/player" || currentPathname === "/the-end") {
            this.updatePlayer();
        } else if (currentPathname === "/game") {
            (this.$data as any).screen = "game-home";
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
        } else if (currentPathname === "/games-overview") {
            (this.$data as any).screen = "games-overview";
        } else {
            (this.$data as any).screen = "create";
        }
    }
});

