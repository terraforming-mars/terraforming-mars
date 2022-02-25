<template>
  <div class='wf-options'>
    <label v-if="showtitle"><div>{{ $t(playerinput.title) }}</div></label>
    <div v-for="(option, idx) in displayedOptions" :key="idx">
      <label class="form-radio">
        <input v-model="selectedOption" type="radio" :name="radioElementName" :value="option" />
        <i class="form-icon" />
        <span>{{ $t(option.title) }}</span>
      </label>
      <div v-if="selectedOption === option" style="margin-left: 30px">
        <player-input-factory ref="inputfactory"
                              :players="players"
                              :playerView="playerView"
                              :playerinput="option"
                              :onsave="playerFactorySaved()"
                              :showsave="false"
                              :showtitle="false" />
      </div>
    </div>
    <div v-if="showsave && selectedOption">
      <div style="margin: 5px 30px 10px" class="wf-action">
        <Button :title="$t(selectedOption.buttonLabel)" type="submit" size="normal" @click="saveData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import Button from '@/client/components/common/Button.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {getPreferences} from '@/client/utils/PreferencesManager';

let unique = 0;

export default Vue.extend({
  name: 'or-options',
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
      throw new Error('no options provided for OrOptions');
    }
    const displayedOptions = this.playerinput.options.filter((o) => Boolean(o.showOnlyInLearnerMode) === false || getPreferences().learner_mode);
    return {
      displayedOptions,
      radioElementName: 'selectOption' + unique++,
      selectedOption: displayedOptions[0],
    };
  },
  methods: {
    playerFactorySaved() {
      const idx = this.playerinput.options?.indexOf(this.selectedOption);
      if (idx === undefined || idx === -1) {
        throw new Error('option not found!');
      }
      return (out: Array<Array<string>>) => {
        const copy = [[String(idx)]];
        for (let i = 0; i < out.length; i++) {
          copy.push(out[i].slice());
        }
        this.onsave(copy);
      };
    },
    saveData() {
      let ref = this.$refs['inputfactory'];
      if (Array.isArray(ref)) {
        ref = ref[0];
      }
      (ref as any).saveData();
    },
  },
});

</script>

