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
        <AppButton :title="$t(selectedOption.buttonLabel)" type="submit" size="normal" @click="saveData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {OrOptionsModel} from '@/common/models/PlayerInputModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {InputResponse, OrOptionsResponse} from '@/common/inputs/InputResponse';

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
      type: Object as () => OrOptionsModel,
    },
    onsave: {
      type: Function as unknown as () => (out: OrOptionsResponse) => void,
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
  data() {
    const displayedOptions = this.playerinput.options.filter((option) => {
      if (option.type !== 'card') {
        return true;
      }
      if (option.showOnlyInLearnerMode === false) {
        return true;
      }

      return getPreferences().learner_mode;
    });
    const initialIdx = this.playerinput.initialIdx ?? 0;
    // Special case: If the first recommended displayed option is SelectCard, and none of them are enabled, skip it.
    let selectedOption = displayedOptions[initialIdx];
    if (displayedOptions.length > 1 &&
      selectedOption.type === 'card' &&
      !selectedOption.cards.some((card) => card.isDisabled !== true)) {
      selectedOption = displayedOptions[initialIdx + 1];
    }
    return {
      displayedOptions,
      radioElementName: 'selectOption' + unique++,
      selectedOption,
    };
  },
  methods: {
    playerFactorySaved() {
      const idx = this.playerinput.options.indexOf(this.selectedOption);
      if (idx === undefined || idx === -1) {
        throw new Error('option not found');
      }
      return (out: InputResponse) => {
        this.onsave({
          type: 'or',
          index: idx,
          response: out,
        });
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

