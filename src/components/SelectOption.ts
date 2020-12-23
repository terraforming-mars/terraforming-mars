import Vue from 'vue';
import {$t} from '../directives/i18n';
import {Button} from '../components/common/Button';
import {PlayerInputModel} from '../models/PlayerInputModel';

export const SelectOption = Vue.component('select-option', {
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
  components: {
    'Button': Button,
  },
  data: function() {
    return {};
  },
  methods: {
    getTitle: function() {
      return $t(this.playerinput.title);
    },
    saveData: function() {
      this.onsave([['1']]);
    },
  },
  template: `<div class="wf-component wf-component--select-option">
        <div v-if="showtitle === true" class="wf-component-title">{{getTitle()}}</div>
        <Button v-if="showsave === true" size="big" :onClick="saveData" :title="playerinput.buttonLabel" />
    </div>`,
});
