import Vue from 'vue';
import {Button} from '../components/common/Button';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {TranslateMixin} from './TranslateMixin';

export const SelectAmount = Vue.component('select-amount', {
  components: {
    'Button': Button,
  },
  mixins: [TranslateMixin],
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
  data: function() {
    return {
      amount: String(this.playerinput.min),
    };
  },
  methods: {
    saveData: function() {
      this.onsave([[String(parseInt(this.amount))]]);
    },
    setMaxValue: function() {
      this.amount = String(this.playerinput.max);
    },
  },
  template: `
    <div>
        <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>
        <div class="flex">
            <input type="number" class="nes-input" value="playerinput.min" :min="playerinput.min" :max="playerinput.max" v-model="amount" />
            <Button size="big" type="max" :onClick="setMaxValue" title="MAX" />
            <Button v-if="showsave === true" size="big" :onClick="saveData" :title="playerinput.buttonLabel" />
        </div>
    </div>`,
});
