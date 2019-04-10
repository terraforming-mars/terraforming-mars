
import Vue from "vue";

import { Board } from "./Board";
import { Card } from "./Card";
import { Player } from "./Player";
import { WaitingFor } from "./WaitingFor";

export const PlayerHome = Vue.component("player-home", {
  props: ["player"],
  components: {
    "board": Board,
    "card": Card,
    "player": Player,
    "waiting-for": WaitingFor
  },
  data: function () {
    return {}
  }
});
