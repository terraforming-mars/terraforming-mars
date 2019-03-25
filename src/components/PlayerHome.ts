
import Vue from "vue";

import { Board } from "./Board";
import { CorporationCard } from "./CorporationCard";
import { ProjectCard } from "./ProjectCard";
import { WaitingFor } from "./WaitingFor";

export const PlayerHome = Vue.component("player-home", {
  props: ["player"],
  components: {
    "board": Board,
    "corporation-card": CorporationCard,
    "project-card": ProjectCard,
    "waiting-for": WaitingFor
  },
  data: function () {
    return {}
  }
});
