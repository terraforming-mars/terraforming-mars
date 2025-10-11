<template>
  <div style="display: contents" :key="componentKey">
    <waiting-for
      :players="players"
      :playerView="playerView"
      :settings="settings"
      :waitingfor="waitingfor"
    />
    <div v-if="showActivate">
      <button @click="activate">time warp</button>
    </div>
    <div v-if="showDeactivate" style="background-color: #444444">
      <button @click="deactivate">reality anchor</button>
      <waiting-for
        :players="players"
        :playerView="playerView"
        :settings="settings"
        :waitingfor="cachedWaitingFor"
        :timeWarpQueue="queue"
        @queue-updated="onQueueUpdated"
      />
      <pre>{{ JSON.stringify(queue, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import * as raw_settings from "@/genfiles/settings.json";
import { vueRoot } from "@/client/components/vueRoot";
import { paths } from "@/common/app/paths";
import WaitingFor from "@/client/components/WaitingFor.vue";
import {
  PublicPlayerModel,
  PlayerViewModel,
} from "@/common/models/PlayerModel";
import {
  OrOptionsModel,
  PlayerInputModel,
} from "@/common/models/PlayerInputModel";

type TimeWarpPayload = {
  runId: string | number;
  index?: number;
  [key: string]: unknown;
};

let timeWarpState: {
  cachedWaitingFor?: OrOptionsModel;
  queue?: TimeWarpPayload[];
} = {};

export default Vue.extend({
  name: "time-warp",
  components: { WaitingFor },

  props: {
    playerView: Object as PropType<PlayerViewModel>,
    players: Array as PropType<PublicPlayerModel[]>,
    settings: Object as PropType<typeof raw_settings>,
    waitingfor: Object as PropType<PlayerInputModel | undefined>,
  },

  computed: {
    showActivate(): boolean {
      return this.showTrinary() === true;
    },
    showDeactivate(): boolean {
      return this.showTrinary() === false;
    },
    styleF(): Record<string, string> {
      return this.showDeactivate ? { backgroundColor: "#444444" } : {};
    },
  },

  watch: {
    waitingfor: {
      immediate: true,
      handler(newVal: PlayerInputModel | undefined) {
        if (!newVal || newVal.type !== "or") {
          return;
        }

        if (!timeWarpState.queue) {
          const clone =
            typeof structuredClone === "function"
              ? structuredClone(newVal)
              : JSON.parse(JSON.stringify(newVal));
          timeWarpState.cachedWaitingFor = clone;
          return;
        }

        const payload = timeWarpState.queue.shift();
        if (!payload) {
          this.deactivate();
          return;
        }

        if (
          timeWarpState.cachedWaitingFor === undefined ||
          payload.index === undefined ||
          !timeWarpState.cachedWaitingFor.options[payload.index]
        ) {
          console.warn("Time warp queue desynced; deactivating.");
          this.deactivate();
          return;
        }

        const selectedOptionStr = JSON.stringify(
          timeWarpState.cachedWaitingFor!.options[payload.index]
        );
        const optionsStrs = newVal.options.map((o) => JSON.stringify(o));
        const index = optionsStrs.indexOf(selectedOptionStr);

        if (index === -1) {
          console.warn(
            "Time warp option was not available in the new prompt; deactivating."
          );
          this.deactivate();
          return;
        }

        payload.index = index;
        const root = vueRoot(this);
        if (root.isServerSideRequestInProgress) {
          console.warn("Server request in progress");
          return;
        }
        root.isServerSideRequestInProgress = true;

        fetch(paths.PLAYER_INPUT + "?id=" + this.playerView.id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Unexpected response: ${res.status}`);
            }
            return res.json();
          })
          .then(() => {
            root.isServerSideRequestInProgress = false;
            if (!timeWarpState.queue || timeWarpState.queue.length === 0) {
              this.deactivate();
            } else {
              this.rerender();
            }
          })
          .catch((err) => {
            console.warn("Time warp replay failed", err);
            root.isServerSideRequestInProgress = false;
            this.deactivate();
          });
      },
    },
  },

  data() {
    return {
      componentKey: 0,
    };
  },

  methods: {
    rerender() {
      this.componentKey += 1;
    },
    activate() {
      timeWarpState.queue = [];
      this.rerender();
    },
    deactivate() {
      timeWarpState.queue = undefined;
      this.rerender();
    },
    onQueueUpdated(queue: TimeWarpPayload[]) {
      timeWarpState.queue = queue;
      this.rerender();
    },
    showTrinary(): boolean | null {
      if (timeWarpState.queue) return false;
      return !this.waitingfor && timeWarpState.cachedWaitingFor ? true : null;
    },
  },
});
</script>
