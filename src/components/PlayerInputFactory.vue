<template>
  <component :is="getComponentName(playerinput.inputType)" :players="players" :player="player" :playerinput="playerinput" :onsave="onsave" :showsave="showsave" :showtitle="showtitle" />
</template>

<script lang="ts">

import Vue from 'vue';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerViewModel, PublicPlayerModel} from '../models/PlayerModel';
import {PlayerInputModel} from '../models/PlayerInputModel';
import AndOptions from './AndOptions.vue';
import OrOptions from './OrOptions.vue';
import SelectAmount from './SelectAmount.vue';
import SelectCard from './SelectCard.vue';
import SelectHowToPay from './SelectHowToPay.vue';
import SelectHowToPayForProjectCard from './SelectHowToPayForProjectCard.vue';
import SelectInitialCards from './SelectInitialCards.vue';
import SelectOption from './SelectOption.vue';
import SelectPlayer from './SelectPlayer.vue';
import SelectSpace from './SelectSpace.vue';
import SelectPartyPlayer from './SelectPartyPlayer.vue';
import SelectPartyToSendDelegate from './SelectPartyToSendDelegate.vue';
import SelectColony from './SelectColony.vue';
import SelectProductionToLose from './SelectProductionToLose.vue';
import ShiftAresGlobalParameters from './ShiftAresGlobalParameters.vue';

export default Vue.component('player-input-factory', {
  props: {
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
    player: {
      type: Object as () => PlayerViewModel,
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
    'and-options': AndOptions,
    'or-options': OrOptions,
    'select-amount': SelectAmount,
    SelectCard,
    'select-option': SelectOption,
    SelectHowToPay,
    SelectHowToPayForProjectCard,
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
    saveData: function() {
      (this.$children[0] as any).saveData();
    },
    getComponentName(inputType: PlayerInputTypes): string {
      switch (inputType) {
      case PlayerInputTypes.AND_OPTIONS:
        return 'and-options';
      case PlayerInputTypes.SELECT_CARD:
        return 'SelectCard';
      case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD:
        return 'SelectHowToPayForProjectCard';
      case PlayerInputTypes.SELECT_INITIAL_CARDS:
        return 'SelectInitialCards';
      case PlayerInputTypes.OR_OPTIONS:
        return 'or-options';
      case PlayerInputTypes.SELECT_OPTION:
        return 'select-option';
      case PlayerInputTypes.SELECT_HOW_TO_PAY:
        return 'SelectHowToPay';
      case PlayerInputTypes.SELECT_SPACE:
        return 'select-space';
      case PlayerInputTypes.SELECT_PLAYER:
        return 'select-player';
      case PlayerInputTypes.SELECT_AMOUNT:
        return 'select-amount';
      case PlayerInputTypes.SELECT_DELEGATE:
        return 'select-party-player';
      case PlayerInputTypes.SELECT_PARTY_TO_SEND_DELEGATE:
        return 'select-party-to-send-delegate';
      case PlayerInputTypes.SELECT_COLONY:
        return 'select-colony';
      case PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE:
        return 'select-production-to-lose';
      case PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS:
        return 'shift-ares-global-parameters';
      default:
        throw 'Unsupported input type: ' + inputType;
      }
    },
  },
});
</script>
