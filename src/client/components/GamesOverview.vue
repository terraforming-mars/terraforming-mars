<template>
  <div id="games-overview" class="games-overview-container">
    <h1 v-i18n>{{ constants.APP_NAME }} — Games Overview</h1>
      <p v-i18n>The following games are available on this server:</p>
      <table>
        <game-overview v-for="entry in entries" :key="entry.id" :id="entry.id" :game="entry.game" :status="entry.status"></game-overview>
      </table>
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
    async getGames() {
      try {
        const response = await fetch('api/games?serverId=' + this.serverId);
        if (!response.ok) {
          alert('Unexpected response fetching games from API');
          return;
        }
        const result: Response[] = await response.json();
        if (result instanceof Array) {
          this.entries = result.map((response) => ({
            id: response.gameId,
            game: undefined,
            status: 'loading',
          }));
          this.entries.forEach((_, idx) => this.getGame(idx));
        } else {
          alert('Unexpected response fetching games from API');
        }
      } catch (error) {
        alert('Error getting games data');
      }
    },
    async getGame(idx: number) {
      if (idx >= this.entries.length) {
        return;
      }
      const entry = this.entries[idx];
      const gameId = entry.id;
      try {
        const response = await fetch('api/game?id=' + gameId);
        if (response.ok) {
          const game = await response.json() as SimpleGameModel;
          entry.status = 'done';
          entry.game = game;
        } else {
          entry.status = 'error';
        }
      } catch (error) {
        entry.status = 'error';
      }
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
