
import Vue from "vue";
import { SelectPlayerRow } from "./SelectPlayerRow";

export const SelectPlayer = Vue.component("select-player", {
    props: ["players", "playerinput", "onsave"],
    data: function () {
        return {
            selectedPlayer: undefined
        };
    },
    components: {
        "select-player-row": SelectPlayerRow
    },
    methods: {
        selectPlayers: function () {
            this.onsave([[this.$data.selectedPlayer]]);
        }
    },
    template: `
        <div>
            <div>{{playerinput.title}} - {{playerinput.message}}</div>
            <label v-for="player in playerinput.players" :key="player" style="display:block;font-size:12px">
                <input class="nes-radio" type="radio" v-model="selectedPlayer" :value="player" />
                <select-player-row :player="players.find((otherPlayer) => otherPlayer.id === player)"></select-player-row>
            </label>
            <button class="nes-btn" v-on:click="selectPlayers">Save</button>
        </div>
    `
});

