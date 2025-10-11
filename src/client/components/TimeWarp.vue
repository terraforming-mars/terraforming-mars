<template>
  <div style="display:contents">
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
import Vue, {PropType} from 'vue';
import * as raw_settings from '@/genfiles/settings.json';
import {vueRoot} from '@/client/components/vueRoot';
import {paths} from '@/common/app/paths';
import WaitingFor from '@/client/components/WaitingFor.vue';
import {PublicPlayerModel, PlayerViewModel} from '@/common/models/PlayerModel';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';

type TimeWarpPayload = {
  runId: string | number;
  index?: number;
  [key: string]: unknown;
};

type TimeWarpState = {
  cachedWaitingFor: PlayerInputModel | undefined;
  queue: TimeWarpPayload[] | undefined;
};

export default Vue.extend({
  name: 'time-warp',
  components: {WaitingFor},

  props: {
    playerView: Object as PropType<PlayerViewModel>,
    players: Array as PropType<PublicPlayerModel[]>,
    settings: Object as PropType<typeof raw_settings>,
    waitingfor: Object as PropType<PlayerInputModel | undefined>,
  },

  data(): TimeWarpState {
    return {
      cachedWaitingFor: undefined,
      queue: undefined,
    };
  },

  computed: {
    showActivate(): boolean {
      return this.showTrinary() === true;
    },
    showDeactivate(): boolean {
      return this.showTrinary() === false;
    },
    styleF(): Record<string, string> {
      return this.showDeactivate ? {backgroundColor: '#444444'} : {};
    },
  },

  watch: {
    waitingfor: {
      immediate: true,
      handler(newVal: PlayerInputModel | undefined) {
        if (!newVal || newVal.type !== 'or') {
          return;
        }

        if (!this.queue) {
          const clone = typeof structuredClone === 'function' ? structuredClone(newVal) : JSON.parse(JSON.stringify(newVal));
          this.cachedWaitingFor = clone;
          return;
        }

        const payload = this.queue.shift();
        if (!payload) {
          this.deactivate();
          return;
        }

        if (this.cachedWaitingFor === undefined ||
          payload.index === undefined ||
          !this.cachedWaitingFor.options[payload.index]) {
          console.warn('Time warp queue desynced; deactivating.');
          this.deactivate();
          return;
        }

        const selectedOptionStr = JSON.stringify(
          this.cachedWaitingFor.options[payload.index],
        );
        const optionsStrs = newVal.options.map((o) => JSON.stringify(o));
        const index = optionsStrs.indexOf(selectedOptionStr);

        if (index === -1) {
          console.warn(
            'Time warp option was not available in the new prompt; deactivating.',
          );
          this.deactivate();
          return;
        }

        payload.index = index;
        const root = vueRoot(this);
        if (root.isServerSideRequestInProgress) {
          console.warn('Server request in progress');
          return;
        }
        root.isServerSideRequestInProgress = true;

        fetch(paths.PLAYER_INPUT + '?id=' + this.playerView.id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
            if (!this.queue || this.queue.length === 0) {
              this.deactivate();
            }
          })
          .catch((err) => {
            console.warn('Time warp replay failed', err);
            root.isServerSideRequestInProgress = false;
            this.deactivate();
          });
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
    onQueueUpdated(queue: TimeWarpPayload[]) {
      this.queue = queue;
    },
    showTrinary(): boolean | null {
      if (this.queue) return false;
      return !this.waitingfor && this.cachedWaitingFor ? true : null;
    },
  },
});
</script>
