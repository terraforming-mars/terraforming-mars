
import Vue from "vue";

import { Board } from "./Board";
import { Card } from "./Card";
import { WaitingFor } from "./WaitingFor";

export const PlayerHome = Vue.component("player-home", {
  props: ["player"],
  components: {
    "board": Board,
    "card": Card,
    "waiting-for": WaitingFor
  },
  data: function () {
    return {}
  }
});
