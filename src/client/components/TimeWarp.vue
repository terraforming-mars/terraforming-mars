<template>
  <div :style="styleF">
    <waiting-for
      :players="players"
      :playerView="playerView"
      :settings="settings"
      :waitingfor="getWaitingFor"
    />
    <button v-if="showActivate" @click="activate">time warp</button>
    <button v-if="showDeactivate" @click="deactivate">reality anchor</button>
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
      return this.waitingfor;
    },
    styleF(): Record<string, string> {
      // spooky season
      return this.showDeactivate ? { backgroundColor: "#444444" } : {};
    },
  },

  watch: {
    // clone only when the prop changes; run immediately on mount
    waitingfor: {
      immediate: true,
      handler(newVal: PlayerInputModel | undefined) {
        if (!newVal) {
          this.cachedWaitingFor = undefined;
          return;
        }
        const clone =
          typeof structuredClone === "function"
            ? structuredClone(newVal)
            : JSON.parse(JSON.stringify(newVal));
        this.cachedWaitingFor = clone;
      },
    },
  },

  methods: {
    activate() {
      alert("activate");
    },
    deactivate() {
      alert("deactivate");
    },
    showTrinary(): boolean | null {
      // true = time warp, false = reality anchor, null = neither
      return null;
    },
  },
});
</script>
