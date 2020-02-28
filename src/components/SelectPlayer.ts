
import Vue from "vue";
import { SelectPlayerRow } from "./SelectPlayerRow";

export const SelectPlayer = Vue.component("select-player", {
    props: ["players", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            selectedPlayer: undefined
        };
    },
    components: {
        "select-player-row": SelectPlayerRow
    },
    methods: {
        saveData: function () {
            this.onsave([[this.$data.selectedPlayer]]);
        }
    },
    template: `<div>
  <div v-if="showtitle === true">{{playerinput.title}}</div>
  <label v-for="player in playerinput.players" :key="player" style="font-size:12px">
    <input type="radio" v-model="selectedPlayer" :value="player" />
    <select-player-row :player="players.find((otherPlayer) => otherPlayer.id === player)"></select-player-row>
  </label>
  <button v-if="showsave === true" class="nes-btn" v-on:click="saveData">Save</button>
</div>`
});

