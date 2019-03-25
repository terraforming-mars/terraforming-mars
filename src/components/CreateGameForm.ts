
import Vue from "vue";
import { Color } from "../Color";

interface CreateGameModel {
    firstIndex: number;
    players: Array<NewPlayerModel>;
}

interface NewPlayerModel {
    name: string;
    color: Color;
    beginner: boolean;
    first: boolean;
}

export const CreateGameForm = Vue.component("create-game-form", {
  data: function () {
    return {
    firstIndex: 0,
    players: [
        { name: "", color: Color.RED, beginner: false, first: false },
        { name: "", color: Color.GREEN, beginner: false, first: false },
        { name: "", color: Color.YELLOW, beginner: false, first: false },
        { name: "", color: Color.BLUE, beginner: false, first: false },
        { name: "", color: Color.BLACK, beginner: false, first: false }
    ]
  } as CreateGameModel},
  methods: {
    createGame: function () {
        const players = this.$data.players.slice().map((player: any, index: number) => {
            player.first = (this.$data.firstIndex === index);
            return player;
        }).filter((player: any) => player.name);
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", "/game");
        xhr.onerror = function () {
            alert("Error creating game");
        }
        xhr.onload = () => {
            if (xhr.status === 200) {
                window.history.replaceState(xhr.response, "Teraforming Mars - Game", "/game?id=" + xhr.response.id);
                this.$root.$data.game = xhr.response;
                this.$root.$data.screen = "game-home";
            } else {
                alert("Unexpected server response");
            }
        };
        xhr.responseType = "json";
        xhr.send(JSON.stringify({
            players: players
        }));
    }
  }
});

