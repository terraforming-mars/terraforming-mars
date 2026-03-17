<template>
  <div class="wf-component wf-component--select-option">
    <div v-if="showtitle === true" class="wf-component-title">{{ $t(playerinput.title) }}</div>
    <div v-if="playerinput.cards || playerinput.greyedOutCards" class="select-option-cards" style="display: flex; flex-wrap: wrap; margin-bottom: 15px; justify-content: center;">
      <div v-for="card in playerinput.cards" :key="card.name" class="cardbox">
        <Card :card="card" />
      </div>
      <div v-for="card in playerinput.greyedOutCards" :key="card.name" class="cardbox">
        <Card :card="card" :actionUsed="true" />
      </div>
    </div>
    <warnings-component :warnings="playerinput.warnings"></warnings-component>
    <AppButton v-if="showsave === true" size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectOptionModel} from '@/common/models/PlayerInputModel';
import {SelectOptionResponse} from '@/common/inputs/InputResponse';
import WarningsComponent from './WarningsComponent.vue';
import Card from '@/client/components/card/Card.vue';

export default defineComponent({
  name: 'select-option',
  props: {
    playerinput: {
      type: Object as () => SelectOptionModel,
      required: true,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectOptionResponse) => void,
      required: true,
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
    WarningsComponent,
    Card,
  },
  methods: {
    saveData() {
      this.onsave({type: 'option'});
    },
  },
});

</script>
