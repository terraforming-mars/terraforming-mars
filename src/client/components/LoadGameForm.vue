<script lang="ts">
import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {LoadGameFormModel} from '@/common/models/LoadGameFormModel';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import {vueRoot} from '@/client/components/vueRoot';
import * as constants from '@/common/constants';
import * as paths from '@/common/app/paths';
import * as HTTPResponseCode from '@/client/utils/HTTPResponseCode';

export default Vue.extend({
  name: 'LoadGameForm',
  components: {
    AppButton,
  },
  data() {
    return {
      constants,
      gameId: '',
      rollbackCount: '0',
    };
  },
  methods: {
    loadGame() {
      const gameId = this.$data.gameId;
      const rollbackCount = this.$data.rollbackCount;
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', paths.LOAD_GAME);
      xhr.onerror = function() {
        alert('Error loading game');
      };
      xhr.onload = () => {
        if (xhr.status === HTTPResponseCode.OK) {
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
        game_id: gameId,
        rollbackCount: rollbackCount,
      };
      xhr.responseType = 'json';
      xhr.send(JSON.stringify(loadGameFormModel));
    },
  },
});
</script>
<template>
  <div id="load-game">
      <h1><span v-i18n>{{ constants.APP_NAME }}</span> — <span v-i18n>Load Game</span></h1>

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
