<template>
  <div class="wf-component wf-options">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
    <label v-for="(token, idx) in playerinput.tokens" :key="idx">
        <input type="radio" v-model="selected" :value="idx" />
          <claimed-token :token="token"></claimed-token>
        <br/>
    </label>
    <div v-if="showsave === true" class="nofloat">
        <AppButton @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectClaimedTokenModel} from '@/common/models/PlayerInputModel';
import {SelectClaimedTokenResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import ClaimedToken from '@/client/components/underworld/ClaimedToken.vue';

export default Vue.extend({
  name: 'SelectClaimedToken',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => SelectClaimedTokenModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectClaimedTokenResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data() {
    return {
      selected: undefined,
    };
  },
  components: {
    AppButton,
    ClaimedToken,
  },
  methods: {
    canSave() {
      return this.selected !== undefined;
    },
    saveData() {
      if (this.selected === undefined) {
        return;
      }
      this.onsave({type: 'claimedtoken', tokens: [this.selected]});
    },
  },
});
</script>
