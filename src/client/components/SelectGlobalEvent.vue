<template>
    <div class="wf-component wf-component--select-global-event">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <label v-for="globalEventName in playerinput.globalEventNames" :key="globalEventName" class="cardBox">
          <input type="radio" v-model="selected" :value="globalEventName" />
          <GlobalEvent :globalEventName="globalEventName" type=""></GlobalEvent>
        </label>
        <div v-if="showsave === true" class="nofloat">
          <AppButton :disabled="selected === undefined" type="submit" @click="saveData" title="OK" />
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import {SelectGlobalEventModel} from '@/common/models/PlayerInputModel';
import {SelectGlobalEventResponse} from '@/common/inputs/InputResponse';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';

type DataModel = {
  selected: GlobalEventName | undefined;
};

export default Vue.extend({
  name: 'SelectGlobalEvent',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => SelectGlobalEventModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectGlobalEventResponse) => void,
    },
    showsave: {
      type: Boolean,
      required: false,
      default: false,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data(): DataModel {
    return {
      selected: undefined,
    };
  },
  components: {
    GlobalEvent,
    AppButton,
  },
  methods: {
    saveData() {
      if (this.selected === undefined) {
        throw new Error('Select a global event');
      }
      this.onsave({type: 'globalEvent', globalEventName: this.selected});
    },
  },
});

</script>
