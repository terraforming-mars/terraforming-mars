<template>
  <tr>

  <!-- single item in GamesOverview -->
  <td><span :class="statusClass"></span></td>
  <td><a :href="'game?id='+id" class="game-id">{{id}}</a></td>
  <template v-if="game !== undefined">
    <td v-for="player in game.players" :key="player.color">
      <span class="player-name" :class="'player_bg_color_'+ player.color">
        <a calassc target="blank" :href="'player?id=' + player.id">{{player.name}}</a>
      </span>
    </td>
    <td><a target="blank" :href="'spectator?id=' + game.spectatorId" v-i18n class="player-name spectator">Spectator</a></td>
  </template>
  </tr>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import {Phase} from '@/common/Phase';

type Status = 'loading' | 'error' | 'done';

export default defineComponent({
  name: 'GameOverview',
  data() {
    return {
    };
  },
  props: {
    status: {
      type: String as () => Status,
      required: true,
    },
    game: {
      type: Object as () => SimpleGameModel | undefined,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    statusClass(): string {
      switch (this.status) {
      case 'loading':
        return 'status-loading';
      case 'error':
        return 'status-error';
      case 'done':
        if (this.isRunning) {
          return 'status-running';
        } else {
          return 'status-finished';
        }
      default:
        return '';
      }
    },
    isRunning(): boolean {
      return this.game?.phase !== Phase.END;
    },
  },
});
</script>
