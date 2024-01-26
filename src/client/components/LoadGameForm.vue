<script lang="ts">
import Vue from 'vue';
import * as constants from '@/common/constants';
import {statusCode} from '@/common/http/statusCode';
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
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', paths.LOAD_GAME);
      xhr.onerror = function() {
        alert('Error loading game');
      };
      xhr.onload = () => {
        if (xhr.status === statusCode.ok) {
          const response = xhr.response as SimpleGameModel;
          if (response.players.length === 1) {
            window.location.href = 'player?id=' + response.players[0].id;
            return;
          } else {
            window.history.replaceState(response, `${constants.APP_NAME} - Game`, 'game?id=' + response.id);
            vueRoot(this).game = response;
            vueRoot(this).screen = 'game-home';
          }
        } else {
          alert('Unexpected server response');
        }
      };
      const loadGameFormModel: LoadGameFormModel = {
        gameId: gameId,
        rollbackCount: rollbackCount,
      };
      xhr.responseType = 'json';
      xhr.send(JSON.stringify(loadGameFormModel));
    },
  },
  computed: {
    APP_NAME(): string {
      return constants.APP_NAME;
    },
  },
});
</script>
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
