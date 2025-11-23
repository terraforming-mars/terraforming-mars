<template>
  <div id="load-game">
      <h1><span v-i18n>{{ APP_NAME }}</span> — <span v-i18n>Load Game</span></h1>

      <div class="load-game-form load-game--block">
          <div class="container load-game-options">
              <div >
                  <label for="gameId">Game, player, or spectator ID to reload:</label><br/>
                  <input class="form-input form-inline load-game-id" :placeholder="'Game Id'" v-model="gameId" /><br/>
                  <label for="rollbackCount">Number of saves to delete before loading:</label><br/>
                  <input class="form-input form-inline load-game-id" value="0" v-model="rollbackCount" /><br/>
                  <AppButton title="Load Game" size="big" type="success" @click="loadGame" />
              </div>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as constants from '@/common/constants';
import AppButton from '@/client/components/common/AppButton.vue';
import {LoadGameFormModel} from '@/common/models/LoadGameFormModel';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import {vueRoot} from '@/client/components/vueRoot';
import {GameId} from '@/common/Types';
import {paths} from '@/common/app/paths';

type LoadGameFormDataModel = {
  gameId: GameId | undefined;
  rollbackCount: number;
};

export default Vue.extend({
  name: 'LoadGameForm',
  components: {
    AppButton,
  },
  data(): LoadGameFormDataModel {
    return {
      gameId: undefined,
      rollbackCount: 0,
    };
  },
  methods: {
    loadGame() {
      const gameId = this.gameId;
      const rollbackCount = this.rollbackCount;
      if (gameId === undefined) {
        alert('Specify a game id');
        return;
      }
      const loadGameForm: LoadGameFormModel = {
        gameId,
        rollbackCount,
      };

      fetch(paths.LOAD_GAME, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loadGameForm),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`Error getting game data: ${resp.statusText}`);
          }
          return resp.json();
        })
        .then((response: SimpleGameModel) => {
          if (response.players.length === 1) {
            window.location.href = 'player?id=' + response.players[0].id;
            return;
          } else {
            window.history.replaceState(response, `${constants.APP_NAME} - Game`, 'game?id=' + response.id);
            vueRoot(this).game = response;
            vueRoot(this).screen = 'game-home';
          }
        })
        .catch((err) => {
          alert('Error loading game');
          console.error(err);
        });
    },
  },
  computed: {
    APP_NAME(): string {
      return constants.APP_NAME;
    },
  },
});
</script>
