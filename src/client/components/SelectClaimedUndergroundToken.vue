<template>
  <div class="wf-component wf-options">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
    <div class="underground-tokens">
      <label v-for="(token, idx) in playerinput.tokens" :key="idx">
         <!-- disabled="selected.length >= playerinput.count -->
        <input type="checkbox" :name="idx" v-model="selected" :value="idx" />
        <underground-token
          :token="token"
          :key="idx"
          location="tag-count"
          ></underground-token>
          <br>
      </label>
    </div>
    <div v-if="showsave === true" class="nofloat">
      <AppButton @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectClaimedUndergroundTokenModel} from '@/common/models/PlayerInputModel';
import {SelectClaimedUndergroundTokenResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import UndergroundToken from '@/client/components/underworld/UndergroundToken.vue';

type DataModel = {
  selected: Array<number>,
};

export default Vue.extend({
  name: 'SelectClaimedUndergroundToken',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => SelectClaimedUndergroundTokenModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectClaimedUndergroundTokenResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data(): DataModel {
    return {
      selected: [],
    };
  },
  components: {
    AppButton,
    UndergroundToken,
  },
  methods: {
    canSave() {
      if (this.selected.length > this.playerinput.max) {
        return false;
      }
      if (this.selected.length < this.playerinput.min) {
        return false;
      }
      return true;
    },
    saveData() {
      this.onsave({type: 'claimedUndergroundToken', selected: this.selected.sort()});
    },
  },
});
</script>
