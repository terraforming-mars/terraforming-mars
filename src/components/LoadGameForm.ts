
import Vue from "vue";
import { Button } from "../components/common/Button";

export const LoadGameForm = Vue.component("load-game-form", {
    components: {
        "Button": Button
    },
    data: function () {
        return {
            gameId: "",
        }
    },
    methods: {
        loadGame: function () {
            const gameId = this.$data.gameId;
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", "/load_game");
            xhr.onerror = function () {
                alert("Error loading game");
            }
            xhr.onload = () => {
                if (xhr.status === 200) {
                    if (xhr.response.players.length === 1) {
                        window.location.href = "/player?id=" + xhr.response.players[0].id;
                        return;
                    } else {
                        window.history.replaceState(xhr.response, "Teraforming Mars - Game", "/game?id=" + xhr.response.id);
                        this.$root.$data.game = xhr.response;
                        this.$root.$data.screen = "game-home";
                    }
                } else {
                    alert("Unexpected server response");
                }
            };
            xhr.responseType = "json";
            xhr.send(JSON.stringify({
                game_id: gameId
            }));
        }
    },
    template: `
        <div id="load-game">
            <h1><span v-i18n>Terraforming Mars</span> — <span v-i18n>Load Game</span></h1>

            <div class="load-game-form load-game--block">
                <div class="container load-game-options">
                    <div>
                        <input class="form-input form-inline load-game-id" :placeholder="'Game Id'" v-model="gameId" />
                        <Button title="Load Game" size="big" type="success" :onClick="loadGame" /> 
                    </div>
                </div>
            </div>
        </div>
    `
});

