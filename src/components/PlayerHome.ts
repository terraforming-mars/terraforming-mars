
import Vue from "vue";

import { Board } from "./Board";
import { Card } from "./Card";
import { ClaimedMilestone } from "./ClaimedMilestone";
import { FundedAward } from "./FundedAward";
import { PlayerInfo } from "./PlayerInfo";
import { PlayerResources } from "./PlayerResources";
import { WaitingFor } from "./WaitingFor";

export const PlayerHome = Vue.component("player-home", {
  props: ["player"],
  components: {
    "board": Board,
    "card": Card,
    "claimed-milestone": ClaimedMilestone,
    "funded-award": FundedAward,
    "player-info": PlayerInfo,
    "player-resources": PlayerResources,
    "waiting-for": WaitingFor
  },
  data: function () {
    return {}
  }
});
