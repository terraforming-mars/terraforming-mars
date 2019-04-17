
import Vue from "vue";

export const GameHome = Vue.component("game-home", {
    props: ["game"],
    data: function () {
        return {}
    },
    template: `
        <div id="game-home">
            <h1>Terraforming Mars - Game Home</h1>
            <p>Send players their links below. As game administrator pick your link to use.</p>
            <ul>
                <li v-for="player in game.players">
                    <a :href="'/player?id=' + player.id">{{player.name}} - {{player.color}}</a>
                </li>
            </ul>
        </div>
    `
});

