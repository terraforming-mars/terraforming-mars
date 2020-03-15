import Vue from "vue";

import {Phase} from "../Phase";

export const GamesOverview = Vue.component("games-overview", {
    data: function () {
        return {
            serverId: '',
            games: {}
        }
    },
    mounted: function() {
        this.serverId = (new URL(location.href)).searchParams.get('serverId') || '';
        this.getGames();
    },
    methods: {
        getGames: function () {
            const vueApp = this;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/games?serverId="+this.serverId);
            xhr.onerror = function () {
                alert("Error getting games data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = xhr.response;
                    if (result instanceof Array) {
                        result.forEach(function (gameId) {
                            (vueApp as any).getGame(gameId);
                        });

                    } else {
                        alert("Unexpected response fetching games from API");
                    }
                } else {
                    alert("Unexpected response fetching games from API");
                }
            }
            xhr.responseType = "json";
            xhr.send();            
        },
        getGame: function (gameId: string) {
            const vueApp = this;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/game?id="+gameId);
            xhr.onerror = function () {
                alert("Error getting game data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = xhr.response;
                    if (result instanceof Object) {
                        Vue.set((vueApp as any).games, gameId, result);
                    } else {
                        alert("Unexpected response fetching game '+gameId+' from API");
                    }
                } else {
                    alert("Unexpected response fetching game '+gameId+' from API");
                }
            }
            xhr.responseType = "json";
            xhr.send();     
        },
        isGameRunning: function (gamePhase: string): boolean {
            return (gamePhase === Phase.END) ? false : true;
        }
    },
    template: `
        <div id="games-overview">
            <h1>Terraforming Mars — Games Overview</h1>
            <p>The following games are available on this server.</p>
            <ul>
                <li v-for="game in games">
                    <a v-bind:href="'/game?id='+game.id">{{game.id}}</a> 
                    with {{game.players.length}} player(s)
                    <span v-if="isGameRunning(game.phase)">is running</span><span v-else>has ended</span>
                </li>
            </ul>
        </div>
    `
});

