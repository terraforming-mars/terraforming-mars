import Vue from 'vue';
import Colony from './Colony.vue';
import {Button} from '../components/common/Button';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {TranslateMixin} from './TranslateMixin';

export const SelectColony = Vue.component('select-colony', {
  props: {
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
  mixins: [TranslateMixin],
  data: function() {
    return {
      selectedColony: undefined as string | undefined,
    };
  },
  components: {
    'colony': Colony,
    'Button': Button,
  },
  methods: {
    saveData: function() {
      const result: string[][] = [];
      result.push([]);
      if (this.selectedColony !== undefined) {
        result[0].push(this.selectedColony);
      }
      this.onsave(result);
    },
  },
  template: `<div class="wf-component wf-component--select-card">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <label v-for="colony in (playerinput.coloniesModel || [])" class="cardbox" :key="colony.name">
            <input type="radio" v-model="selectedColony" :value="colony.name" />
            <colony :colony="colony"></colony>
        </label>
        <div v-if="showsave === true" class="nofloat">
            <Button :onClick="saveData" :title="playerinput.buttonLabel" /> 
        </div>
    </div>`,
});

