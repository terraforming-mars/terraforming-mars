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
      this.queue = [];
    },
    deactivate() {
      this.queue = undefined;
    },
    showTrinary(): boolean | null {
      // true = time warp, false = reality anchor, null = neither
      if (this.queue) {
        return false;
      }
      return !this.waitingfor && this.cachedWaitingFor ? true : null;
    },
    updated(): void {
      if (!!this.waitingfor && !!this.queue) {
        const payload = this.queue.shift();
        const root = vueRoot(this);
        if (root.isServerSideRequestInProgress) {
          console.warn("Server request in progress");
          return;
        }
        root.isServerSideRequestInProgress = true;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", paths.PLAYER_INPUT + "?id=" + this.playerView.id);
        xhr.responseType = "json";
        xhr.onload = () => {
          root.isServerSideRequestInProgress = false;
          if (this.queue.length === 0) this.deactivate();
        };
        xhr.onerror = function () {
          // todo(kberg): Report error to caller
          root.isServerSideRequestInProgress = false;
          this.deactivate();
        };
        xhr.send(JSON.stringify(payload));
      }
    },
  },
});
</script>
