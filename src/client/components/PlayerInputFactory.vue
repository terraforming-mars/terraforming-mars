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
import SelectPartyPlayer from '@/client/components/SelectPartyPlayer.vue';
import SelectPartyToSendDelegate from '@/client/components/SelectPartyToSendDelegate.vue';
import SelectColony from '@/client/components/SelectColony.vue';
import SelectProductionToLose from '@/client/components/SelectProductionToLose.vue';
import ShiftAresGlobalParameters from '@/client/components/ShiftAresGlobalParameters.vue';
import {InputResponse} from '@/common/inputs/InputResponse';

const typeToComponentName: Record<PlayerInputType, string> = {
  [PlayerInputType.AND_OPTIONS]: 'and-options',
  [PlayerInputType.SELECT_CARD]: 'SelectCard',
  [PlayerInputType.SELECT_PROJECT_CARD_TO_PLAY]: 'SelectProjectCardToPlay',
  [PlayerInputType.SELECT_INITIAL_CARDS]: 'SelectInitialCards',
  [PlayerInputType.OR_OPTIONS]: 'or-options',
  [PlayerInputType.SELECT_OPTION]: 'select-option',
  [PlayerInputType.SELECT_PAYMENT]: 'SelectPayment',
  [PlayerInputType.SELECT_SPACE]: 'select-space',
  [PlayerInputType.SELECT_PLAYER]: 'select-player',
  [PlayerInputType.SELECT_AMOUNT]: 'select-amount',
  [PlayerInputType.SELECT_DELEGATE]: 'select-party-player',
  [PlayerInputType.SELECT_PARTY_TO_SEND_DELEGATE]: 'select-party-to-send-delegate',
  [PlayerInputType.SELECT_COLONY]: 'select-colony',
  [PlayerInputType.SELECT_PRODUCTION_TO_LOSE]: 'select-production-to-lose',
  [PlayerInputType.SHIFT_ARES_GLOBAL_PARAMETERS]: 'shift-ares-global-parameters',
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
    'select-party-player': SelectPartyPlayer,
    'select-party-to-send-delegate': SelectPartyToSendDelegate,
    'select-colony': SelectColony,
    SelectProductionToLose,
    ShiftAresGlobalParameters,
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
      return typeToComponentName[this.playerinput.inputType];
    },
  },
});
</script>
