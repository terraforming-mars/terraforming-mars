
import Vue from "vue";
import { SelectPlayerRow } from "./SelectPlayerRow";
import { Button } from "../components/common/Button";

export const SelectPlayer = Vue.component("select-player", {
    props: ["players", "playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            selectedPlayer: undefined
        };
    },
    components: {
        "select-player-row": SelectPlayerRow,
        "Button": Button
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
    <select-player-row :player="players.find((otherPlayer) => otherPlayer.id === player)"></select-player-row>
  </label>
  <Button v-if="showsave === true" size="big" :onClick="saveData" :title="playerinput.buttonLabel" />
</div>`
});

