
import Vue from "vue";

export const GameHome = Vue.component("game-home", {
    props: ["game","undoable"],
    data: function () {
        return {}
    },
    methods: {
        deleteGame: function () {
            console.log("delete");
            if(window.confirm("Sure to Delete?")){
                window.open("api/gamedelete?id="+this.game.id);
            }
        }
    },
    template: `
        <div id="game-home">
            <h1>Terraforming Mars - Game Home</h1>
            <p>Send players their links below. As game administrator pick your link to use.</p>
            Game Age： {{game.gameAge}} ,Last Save Id : {{game.saveId}}  --&gt;
            <a v-if="undoable == true" v-bind:href="'api/gameback?id='+game.id" target="_blank" > ROLLBACk</a>
            <button v-if="undoable == true" v-on:click="deleteGame()"   > DELETE</button>
            <ul>
                <li v-for="player in game.players">
                        <span class="player_home_block nofloat">
                            <span class="player_name" :class="'player_bg_color_'+ player.color"><a :href="'/player?id=' + player.id">{{player.name}}</a></span>
                        </span>
                </li>
            </ul>
        </div>
    `
});

