<template>
  <div class='wf-options'>
    <div v-if="showtitle" class="wf-title">{{ $t(playerinput.title) }}</div>
    <player-input-factory v-for="(option, idx) in (playerinput.options || [])"
      :key="idx"
      :players="players"
      :playerView="playerView"
      :playerinput="option"
      :onsave="playerFactorySaved(idx)"
      :showsave="false"
      :showtitle="true" />
    <div v-if="showsave" class="wf-action">
      <Button :title="playerinput.buttonLabel" type="submit" size="normal" @click="saveData" :disabled="!canSave()"/>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {PlayerViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import Button from '@/client/components/common/Button.vue';

export default Vue.extend({
  name: 'and-options',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  components: {
    Button,
  },
  data() {
    if (this.playerinput.options === undefined) {
      throw new Error('options must be defined');
    }
    return {
      responded: this.playerinput.options.map(() => undefined),
    };
  },
  methods: {
    playerFactorySaved(idx: number) {
      return (out: Array<Array<string>>) => {
        this.$data.responded[idx] = out[0];
      };
    },
    canSave(): boolean {
      for (const child of this.$children) {
        const canSave = (child as any).canSave;
        if (canSave instanceof Function) {
          if (canSave() === false) {
            return false;
          }
        }
      }
      return true;
    },
    saveData() {
      if (this.canSave() === false) {
        alert('Not all options selected');
        return;
      }
      for (const child of this.$children) {
        if ((child as any).saveData instanceof Function) {
          (child as any).saveData();
        }
      }
      this.onsave(this.$data.responded);
    },
  },
});

</script>

