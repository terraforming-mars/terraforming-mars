<!-- single item in GamesOverview -->
<template>
  <span>
    <a v-bind:href="'/game?id='+id">{{id}}</a>
    <template v-if="game === undefined">
      ...{{status}}
    </template>
    <template v-else>
      with {{game.players.length}} player(s) :
      <span class="player_home_block nofloat" >
          <span v-for="player in game.players" class="player_name" :class="'player_bg_color_'+ player.color" :key="player.color">
              <a target="blank" :href="'/player?id=' + player.id">{{player.name}}</a>
          </span>
          <!-- TODO(kberg) Give spectator a color. -->
          <a target="blank" :href="'/spectator?id=' + game.spectatorId">Spectator</a>
          <span v-if="isRunning()">is running</span><span v-else>has ended</span>
      </span>
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import {Phase} from '@/common/Phase';

export default Vue.extend({
  name: 'GameOverview',
  data() {
    return {
    };
  },
  props: {
    status: {
      type: String,
    },
    game: {
      type: Object as () => SimpleGameModel | undefined,
    },
    id: {
      type: String,
    },
  },
  methods: {
    isRunning(): boolean {
      return this.game?.phase !== Phase.END;
    },
  },
});
</script>
