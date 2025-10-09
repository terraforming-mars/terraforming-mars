<template>
  <div style="display: contents">
    <waiting-for
      :players="players"
      :playerView="playerView"
      :settings="settings"
      :waitingfor="getWaitingFor"
    />
    <button v-if="showButton" @click="activate">time warp</button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import * as raw_settings from "@/genfiles/settings.json";
import WaitingFor from "@/client/components/WaitingFor.vue";
import type {
  PlayerViewModel,
  PublicPlayerModel,
  PlayerInputModel,
  Color,
} from "@/client/models";

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
      waitingForTimeout:
        raw_settings.waitingForTimeout as typeof raw_settings.waitingForTimeout,
      playersWaitingFor: [] as Color[],
      suspend: false,
      savedPlayerView: undefined as PlayerViewModel | undefined,

      cachedWaitingFor: undefined as PlayerInputModel | undefined,
    };
  },

  computed: {
    showButton(): boolean {
      return true;
    },
    getWaitingFor(): PlayerInputModel | undefined {
      return this.waitingfor;
    },
  },

  mounted() {
    if (this.waitingfor) {
      const clone =
        typeof structuredClone === "function"
          ? structuredClone(this.waitingfor)
          : JSON.parse(JSON.stringify(this.waitingfor));
      this.cachedWaitingFor = clone;
    }
  },

  methods: {
    activate() {
      alert("activate");
    },
  },
});
</script>
