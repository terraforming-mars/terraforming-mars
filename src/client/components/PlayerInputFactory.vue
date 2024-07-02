<template>
  <component :is="componentName"
    :players="players"
    :playerView="playerView"
    :playerinput="playerinput"
    :onsave="onsave"
    :showsave="showsave"
    :showtitle="showtitle"/>
</template>

<script lang="ts">

import Vue from 'vue';
import {PlayerInputType} from '@/common/input/PlayerInputType';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {InputResponse} from '@/common/inputs/InputResponse';
import AndOptions from '@/client/components/AndOptions.vue';
import OrOptions from '@/client/components/OrOptions.vue';
import SelectAmount from '@/client/components/SelectAmount.vue';
import SelectCard from '@/client/components/SelectCard.vue';
import SelectPayment from '@/client/components/SelectPayment.vue';
import SelectProjectCardToPlay from '@/client/components/SelectProjectCardToPlay.vue';
import SelectInitialCards from '@/client/components/SelectInitialCards.vue';
import SelectOption from '@/client/components/SelectOption.vue';
import SelectPlayer from '@/client/components/SelectPlayer.vue';
import SelectSpace from '@/client/components/SelectSpace.vue';
import SelectDelegate from '@/client/components/SelectDelegate.vue';
import SelectParty from '@/client/components/SelectParty.vue';
import SelectColony from '@/client/components/SelectColony.vue';
import SelectProductionToLose from '@/client/components/SelectProductionToLose.vue';
import ShiftAresGlobalParameters from '@/client/components/ShiftAresGlobalParameters.vue';
import SelectGlobalEvent from '@/client/components/SelectGlobalEvent.vue';
import SelectResource from '@/client/components/SelectResource.vue';
import SelectResources from '@/client/components/SelectResources.vue';

const typeToComponentName: Record<PlayerInputType, string> = {
  'and': 'and-options',
  'card': 'SelectCard',
  'projectCard': 'SelectProjectCardToPlay',
  'initialCards': 'SelectInitialCards',
  'or': 'or-options',
  'option': 'select-option',
  'payment': 'SelectPayment',
  'space': 'select-space',
  'player': 'select-player',
  'amount': 'select-amount',
  'delegate': 'select-delegate',
  'party': 'select-party',
  'colony': 'select-colony',
  'productionToLose': 'select-production-to-lose',
  'aresGlobalParameters': 'shift-ares-global-parameters',
  'globalEvent': 'select-global-event',
  'policy': 'select-policy',
  'resource': 'select-resource',
  'resources': 'select-resources',
};

export default Vue.component('player-input-factory', {
  props: {
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: InputResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  components: {
    'and-options': AndOptions,
    'or-options': OrOptions,
    'select-amount': SelectAmount,
    SelectCard,
    'select-option': SelectOption,
    SelectPayment,
    SelectProjectCardToPlay,
    SelectInitialCards,
    'select-player': SelectPlayer,
    'select-space': SelectSpace,
    'select-delegate': SelectDelegate,
    'select-party': SelectParty,
    'select-colony': SelectColony,
    SelectProductionToLose,
    ShiftAresGlobalParameters,
    SelectGlobalEvent,
    'select-resource': SelectResource,
    'select-resources': SelectResources,
  },
  methods: {
    saveData() {
      (this.$children[0] as any).saveData();
    },
    canSave(): boolean {
      const canSave = (this.$children[0] as any).canSave;
      return canSave ? canSave() : true;
    },
  },
  computed: {
    componentName(): string {
      return typeToComponentName[this.playerinput.type];
    },
  },
});
</script>
