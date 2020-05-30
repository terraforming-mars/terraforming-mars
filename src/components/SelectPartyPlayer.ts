
import Vue from "vue";
import { SelectPlayerRow } from "./SelectPlayerRow";

export const SelectPartyPlayer = Vue.component("select-party-player", {
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
  <label v-for="player in playerinput.players" :key="player" class="form-radio form-inline">
    <input type="radio" v-model="selectedPlayer" :value="player" />
    <i class="form-icon"></i>
    <span v-if="player === 'NEUTRAL'" >Neutral</span>
    <select-player-row v-else :player="players.find((otherPlayer) => otherPlayer.id === player)"></select-player-row>
  </label>
  <button v-if="showsave === true" class="btn btn-lg btn-primary" v-on:click="saveData">Save</button>
</div>`
});

