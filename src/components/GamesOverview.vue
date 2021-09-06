<template>
        <div id="games-overview">
            <h1>{{ constants.APP_NAME }} — Games Overview</h1>
            <p>The following games are available on this server:</p>
            <ul>
                <li v-for="game in games" :key="game.id">
                    <a v-bind:href="'/game?id='+game.id">{{game.id}}</a>
                    with {{game.players.length}} player(s) :
                    <span class="player_home_block nofloat" >
                        <span v-for="player in game.players" class="player_name" :class="'player_bg_color_'+ player.color" :key="player.color">
                            <a :href="'/player?id=' + player.id">{{player.name}}</a>
                        </span>
                        <span v-if="isGameRunning(game.phase)">is running</span><span v-else>has ended</span>
                    </span>
                </li>
            </ul>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';

import {Phase} from '@/Phase';

import * as constants from '@/constants';

export default Vue.extend({
  name: 'games-overview',
  data() {
    return {
      constants,
      serverId: '',
      games: {},
    };
  },
  mounted() {
    this.serverId = (new URL(location.href)).searchParams.get('serverId') || '';
    this.getGames();
  },
  methods: {
    getGames() {
      const vueApp = this;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/games?serverId='+this.serverId);
      xhr.onerror = function() {
        alert('Error getting games data');
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = xhr.response;
          if (result instanceof Array) {
            result.forEach(function(gameId) {
              (vueApp as any).getGame(gameId.id);
            });
          } else {
            alert('Unexpected response fetching games from API');
          }
        } else {
          alert('Unexpected response fetching games from API');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    },
    getGame(gameId: string) {
      const vueApp = this;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/game?id='+gameId);
      xhr.onerror = function() {
        alert('Error getting game data');
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = xhr.response;
          if (result instanceof Object) {
            Vue.set((vueApp as any).games, gameId, result);
          } else {
            alert('Unexpected response fetching game \'+gameId+\' from API');
          }
        } else {
          alert('Unexpected response fetching game \'+gameId+\' from API');
        }
      };
      xhr.responseType = 'json';
      xhr.send();
    },
    isGameRunning(gamePhase: string): boolean {
      return (gamePhase === Phase.END) ? false : true;
    },
  },
});

</script>

