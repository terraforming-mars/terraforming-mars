<template>
  <div id="games-overview">
    <h1 v-i18n>{{ constants.APP_NAME }} — Games Overview</h1>
      <p v-i18n>The following games are available on this server:</p>
      <ul>
        <li v-for="entry in entries" :key="entry.id">
          <game-overview :id="entry.id" :game="entry.game" :status="entry.status"></game-overview>
        </li>
    </ul>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import * as constants from '@/common/constants';
import GameOverview from '@/client/components/admin/GameOverview.vue';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import {GameId, ParticipantId} from '@/common/Types';

type FetchStatus = {
  id: GameId;
  game: SimpleGameModel | undefined;
  status: string;
}
type DataModel = {
  entries: Array<FetchStatus>,
};

// Copied from routes/Game.ts and probably IDatabase. Should be centralized I suppose
type Response = {gameId: GameId, participants: Array<ParticipantId>};

export default Vue.extend({
  name: 'games-overview',
  data(): DataModel {
    return {
      entries: [],
    };
  },
  mounted() {
    this.getGames();
  },
  components: {
    GameOverview,
  },
  methods: {
    getGames() {
      const vueApp = this;

      const url = 'api/games?serverId='+this.serverId;
      fetch(url)
        .then((resp) => resp.json())
        .then((result: Response[]) => {
          if (result instanceof Array) {
            result.forEach(function(response) {
              vueApp.entries.push({
                id: response.gameId,
                game: undefined,
                status: 'loading',
              });
            });
            vueApp.getGame(0);
            return;
          }
        })
        .catch((err) => alert(err));
    },
    getGame(idx: number) {
      if (idx >= this.entries.length) {
        return;
      }
      const entry = this.entries[idx];
      const gameId = entry.id;

      const url = 'api/game?id='+gameId;
      fetch(url)
        .then((resp) => resp.json())
        .then((game: SimpleGameModel) => {
          if (game instanceof Object) {
            entry.status = 'done';
            entry.game = game;
            this.getGame(idx + 1);
            return;
          }
        })
        .catch(() => {
          entry.status = 'error';
          this.getGame(idx + 1);
        });
    },
  },
  computed: {
    constants(): typeof constants {
      return constants;
    },
    serverId(): string {
      return (new URL(location.href)).searchParams.get('serverId') || '';
    },
  },
});
</script>

