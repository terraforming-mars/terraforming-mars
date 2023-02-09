<template>
  <component :is="getComponentName(playerinput.inputType)"
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
    getComponentName(inputType: PlayerInputType): string {
      switch (inputType) {
      case PlayerInputType.AND_OPTIONS:
        return 'and-options';
      case PlayerInputType.SELECT_CARD:
        return 'SelectCard';
      case PlayerInputType.SELECT_PROJECT_CARD_TO_PLAY:
        return 'SelectProjectCardToPlay';
      case PlayerInputType.SELECT_INITIAL_CARDS:
        return 'SelectInitialCards';
      case PlayerInputType.OR_OPTIONS:
        return 'or-options';
      case PlayerInputType.SELECT_OPTION:
        return 'select-option';
      case PlayerInputType.SELECT_PAYMENT:
        return 'SelectPayment';
      case PlayerInputType.SELECT_SPACE:
        return 'select-space';
      case PlayerInputType.SELECT_PLAYER:
        return 'select-player';
      case PlayerInputType.SELECT_AMOUNT:
        return 'select-amount';
      case PlayerInputType.SELECT_DELEGATE:
        return 'select-party-player';
      case PlayerInputType.SELECT_PARTY_TO_SEND_DELEGATE:
        return 'select-party-to-send-delegate';
      case PlayerInputType.SELECT_COLONY:
        return 'select-colony';
      case PlayerInputType.SELECT_PRODUCTION_TO_LOSE:
        return 'select-production-to-lose';
      case PlayerInputType.SHIFT_ARES_GLOBAL_PARAMETERS:
        return 'shift-ares-global-parameters';
      default:
        throw new Error('Unsupported input type: ' + inputType);
      }
    },
  },
});
</script>
