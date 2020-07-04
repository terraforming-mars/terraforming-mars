import Vue from "vue";

import {Phase} from "../Phase";

export const MyGames = Vue.component("my-games", {
    data: function () {
        return {
            userId: "",
            userName: "",
            games: {}
        }
    },
    mounted: function() {
        this.userId = localStorage.getItem("userId") || "";
        this.userName = localStorage.getItem("userName") || "";
        if(this.userId.length > 0){
            this.getGames();
        }
    },
    methods: {
        getGames: function () {
            const vueApp = this;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/mygames?id="+this.userId);
            xhr.onerror = function () {
                alert("Error getting games data");
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = xhr.response;
                    if (result instanceof Array) {
                        (vueApp as any).games = result;
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
        isGameRunning: function (gamePhase: string): boolean {
            return (gamePhase === Phase.END) ? false : true;
        },
        changeLogin: function (): void {
            if(this.userName !== ""){
                this.userId = "";
                this.userName = "";
                localStorage.removeItem("userId") ;
                localStorage.removeItem("userName");
            }else{
                window.location.href = "/login" ;
            }
        }
    },
    template: `
        <div id="games-overview">
            <h1><span v-i18n>Terraforming Mars</span> — <span v-i18n>My Games</span> <button class="btn btn-lg btn-success" v-on:click="changeLogin" v-i18n><span v-if="userName">LoginOut</span><span v-else>Login</span></button></h1>
            <div v-if="userName">
                <p>Hello <span class="user-name">{{userName}}</span>,the following games are related with you:</p>
            </div>
            <ul>
                <li v-for="game in games">
                    <a v-bind:href="'/game?id='+game.id" target="_blank" >{{game.id}}</a> 
                    <span>{{game.createtime}}  {{game.updatetime}}  </span>
                    age: {{game.gameAge}} 
                    with {{game.players.length}} player(s) : 
                    <span class="player_home_block nofloat" >
                        <span v-for="player in game.players" class="player_name" :class="'player_bg_color_'+ player.color">
                            <a :href="'/player?id=' + player.id">{{player.name}}</a>
                        </span>
                        <span v-if="isGameRunning(game.phase)">is running</span><span v-else>has ended</span>
                    </span>
                </li>
            </ul>
        </div>
    `
});

