<template>
  <div :style="styleF">
    <waiting-for
      :players="players"
      :playerView="playerView"
      :settings="settings"
      :waitingfor="getWaitingFor"
      :timeWarpQueue="queue"
    />
    <div v-if="showActivate">
      <button @click="activate">time warp</button>
    </div>
    <div v-if="showDeactivate">
      <button @click="deactivate">reality anchor</button>
      <pre>{{ JSON.stringify(queue, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import * as raw_settings from "@/genfiles/settings.json";
import WaitingFor from "@/client/components/WaitingFor.vue";
import {
  PublicPlayerModel,
  PlayerViewModel,
} from "@/common/models/PlayerModel";
import { PlayerInputModel } from "@/common/models/PlayerInputModel";

export default Vue.extend({
  name: "time-warp",
  components: { WaitingFor },

  props: {
    playerView: Object as PropType<PlayerViewModel>,
    players: Array as PropType<PublicPlayerModel[]>,
    settings: Object as PropType<typeof raw_settings>,
    waitingfor: Object as PropType<PlayerInputModel | undefined>,
  },

  data() {
    return {
      cachedWaitingFor: undefined as PlayerInputModel | undefined,
      queue: undefined as any[] | undefined,
    };
  },

  computed: {
    showActivate(): boolean {
      return this.showTrinary() === true;
    },
    showDeactivate(): boolean {
      return this.showTrinary() === false;
    },
    getWaitingFor(): PlayerInputModel | undefined {
      if (this.showTrinary() === false) {
        return this.cachedWaitingFor;
      }
      return this.waitingfor;
    },
    styleF(): Record<string, string> {
      return this.showDeactivate ? { backgroundColor: "#444444" } : {};
    },
  },
  watch: {
    waitingfor: {
      immediate: true,
      handler(newVal: PlayerInputModel | undefined) {
        if (!newVal) {
          this.cachedWaitingFor = undefined;
          //return;
        }
        const clone =
          {
            title: "Take your next action",
            buttonLabel: "Take action",
            type: "or",
            options: [
              {
                title: "Play project card",
                buttonLabel: "Play card",
                type: "projectCard",
                cards: [
                  {
                    name: "Nuclear Zone",
                    calculatedCost: 10,
                    reserveUnits: {
                      megacredits: 0,
                      steel: 0,
                      titanium: 0,
                      plants: 0,
                      energy: 0,
                      heat: 0,
                    },
                  },
                  {
                    name: "Media Group",
                    calculatedCost: 6,
                    reserveUnits: {
                      megacredits: 0,
                      steel: 0,
                      titanium: 0,
                      plants: 0,
                      energy: 0,
                      heat: 0,
                    },
                  },
                  {
                    name: "Virus",
                    calculatedCost: 1,
                    reserveUnits: {
                      megacredits: 0,
                      steel: 0,
                      titanium: 0,
                      plants: 0,
                      energy: 0,
                      heat: 0,
                    },
                  },
                  {
                    name: "Adaptation Technology",
                    calculatedCost: 12,
                    reserveUnits: {
                      megacredits: 0,
                      steel: 0,
                      titanium: 0,
                      plants: 0,
                      energy: 0,
                      heat: 0,
                    },
                  },
                  {
                    name: "Arctic Algae",
                    calculatedCost: 12,
                    reserveUnits: {
                      megacredits: 0,
                      steel: 0,
                      titanium: 0,
                      plants: 0,
                      energy: 0,
                      heat: 0,
                    },
                  },
                ],
                microbes: 0,
                floaters: 0,
                paymentOptions: {
                  heat: false,
                  lunaTradeFederationTitanium: false,
                  plants: false,
                },
                lunaArchivesScience: 0,
                seeds: 0,
                graphene: 0,
                kuiperAsteroids: 0,
              },
              {
                title: "End Turn",
                buttonLabel: "End",
                type: "option",
              },
              {
                title: {
                  data: [
                    {
                      type: 1,
                      value: "8",
                    },
                  ],
                  message: "Fund an award (${0} M€)",
                },
                buttonLabel: "Confirm",
                type: "or",
                options: [
                  {
                    title: "Landlord",
                    buttonLabel: "Fund - (Landlord)",
                    type: "option",
                  },
                  {
                    title: "Scientist",
                    buttonLabel: "Fund - (Scientist)",
                    type: "option",
                  },
                  {
                    title: "Banker",
                    buttonLabel: "Fund - (Banker)",
                    type: "option",
                  },
                  {
                    title: "Thermalist",
                    buttonLabel: "Fund - (Thermalist)",
                    type: "option",
                  },
                  {
                    title: "Miner",
                    buttonLabel: "Fund - (Miner)",
                    type: "option",
                  },
                ],
                initialIdx: 0,
              },
              {
                title: "Standard projects",
                buttonLabel: "Confirm",
                type: "card",
                cards: [
                  {
                    resources: 0,
                    name: "Power Plant:SP",
                    calculatedCost: 11,
                  },
                  {
                    resources: 0,
                    name: "Asteroid:SP",
                    calculatedCost: 14,
                    isDisabled: true,
                  },
                  {
                    resources: 0,
                    name: "Aquifer",
                    calculatedCost: 18,
                    isDisabled: true,
                  },
                  {
                    resources: 0,
                    name: "Greenery",
                    calculatedCost: 23,
                    isDisabled: true,
                  },
                  {
                    resources: 0,
                    name: "City",
                    calculatedCost: 25,
                    isDisabled: true,
                  },
                ],
                max: 1,
                min: 1,
                showOnlyInLearnerMode: false,
                selectBlueCardAction: false,
                showOwner: false,
              },
              {
                title: "Pass for this generation",
                buttonLabel: "Pass",
                type: "option",
                warnings: ["pass"],
              },
              {
                title: "Sell patents",
                buttonLabel: "Sell",
                type: "card",
                cards: [
                  {
                    name: "Io Mining Industries",
                    calculatedCost: 41,
                  },
                  {
                    name: "Nuclear Zone",
                    calculatedCost: 10,
                  },
                  {
                    name: "Advanced Ecosystems",
                    calculatedCost: 11,
                  },
                  {
                    name: "Breathing Filters",
                    calculatedCost: 11,
                  },
                  {
                    name: "Media Group",
                    calculatedCost: 6,
                  },
                  {
                    name: "Virus",
                    calculatedCost: 1,
                  },
                  {
                    name: "Ice Cap Melting",
                    calculatedCost: 5,
                  },
                  {
                    name: "Gene Repair",
                    calculatedCost: 12,
                  },
                  {
                    name: "Adaptation Technology",
                    calculatedCost: 12,
                  },
                  {
                    name: "Arctic Algae",
                    calculatedCost: 12,
                  },
                ],
                max: 10,
                min: 1,
                showOnlyInLearnerMode: false,
                selectBlueCardAction: false,
                showOwner: false,
              },
            ],
            initialIdx: 0,
          } ||
          (typeof structuredClone === "function"
            ? structuredClone(newVal)
            : JSON.parse(JSON.stringify(newVal)));
        this.cachedWaitingFor = clone;
      },
    },
  },
  methods: {
    activate() {
      this.queue = []
    },
    deactivate() {
      this.queue = undefined
    },
    showTrinary(): boolean | null {
      // true = time warp, false = reality anchor, null = neither
      if (this.queue) {
        return false;
      }
      return !this.waitingfor && this.cachedWaitingFor ? true : null;
    },
  },
});
</script>
