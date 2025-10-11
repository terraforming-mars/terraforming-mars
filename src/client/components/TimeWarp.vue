<template>
  <div style="display: content">
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

let DATA_STATE = {
  cachedWaitingFor: undefined as OrOptionsModel | undefined,
  queue: undefined as any[] | undefined,
};

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
    return DATA_STATE;
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
  mounted() {
    this.handleNewVal(this.waitingfor);
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
      if (this.queue) return false;
      return !this.waitingfor && this.cachedWaitingFor ? true : null;
    },
    handleNewVal(newVal: PlayerInputModel | undefined): void {
      if (newVal && newVal.type === "or") {
        if (!this.queue) {
          const clone =
            typeof structuredClone === "function"
              ? structuredClone(newVal)
              : JSON.parse(JSON.stringify(newVal));
          this.cachedWaitingFor = clone;
        } else {
          const payload = this.queue.shift();
          if (!payload) {
            this.deactivate();
            return;
          }
          const selectedOptionTitle =
            this.cachedWaitingFor?.options[payload.index].title;
          const optionsTitles = newVal.options.map((o) => o.title);
          const index = optionsTitles.indexOf(selectedOptionTitle!);
          if (index === -1) {
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
            .then((resp) => {
              if (!resp.ok) {
                throw new Error(`Error getting game data: ${resp.statusText}`);
              }
              return resp.json();
            })
            .then((playerView: PlayerViewModel | undefined) => {
              root.isServerSideRequestInProgress = false;
              if (!this.queue || this.queue.length === 0) this.deactivate();

              root.screen = "empty";
              root.playerView = playerView;
              root.playerkey++;
              root.screen = "player-home";
            })
            .catch(() => {
              root.isServerSideRequestInProgress = false;
              this.deactivate();
            });
        }
      }
    },
  },
});
</script>
