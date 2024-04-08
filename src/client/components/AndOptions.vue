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
      <AppButton :title="playerinput.buttonLabel" type="submit" size="normal" @click="saveData" :disabled="!canSave()"/>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {AndOptionsModel} from '@/common/models/PlayerInputModel';
import AppButton from '@/client/components/common/AppButton.vue';
import {AndOptionsResponse, InputResponse} from '@/common/inputs/InputResponse';

interface DataModel {
  responded: Array<InputResponse | undefined>,
}

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
      type: Object as () => AndOptionsModel,
    },
    onsave: {
      type: Function as unknown as () => (out: AndOptionsResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  components: {
    AppButton,
  },
  data(): DataModel {
    if (this.playerinput.options === undefined) {
      throw new Error('options must be defined');
    }
    return {
      responded: this.playerinput.options.map(() => undefined),
    };
  },
  methods: {
    playerFactorySaved(idx: number) {
      return (out: InputResponse) => {
        this.responded[idx] = out;
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
      this.onsave({
        type: 'and',
        responses: this.responded as Array<InputResponse>,
      });
    },
  },
});

</script>

