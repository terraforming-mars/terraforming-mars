<template>
  <component :is="resolvedComponent"
    ref="childInput"
    :playerView="playerView"
    :playerinput="playerinput"
    :onsave="onsave"
    :showsave="showsave"
    :showtitle="showtitle" />
</template>

<script lang="ts">

import {Component, defineComponent} from 'vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
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
import SelectClaimedUndergroundToken from '@/client/components/SelectClaimedUndergroundToken.vue';
import DeltaProjectInput from '@/client/components/delta/DeltaProjectInput.vue';

// Shared contract every input component must satisfy. `playerinput` and
// `onsave` are narrowed to the discriminated variant whose `type` matches K.
type InputComponentProps<K extends PlayerInputModel['type']> = {
  playerView: PlayerViewModel;
  playerinput: Extract<PlayerInputModel, {type: K}>;
  onsave: (out: Extract<InputResponse, {type: K}>) => void;
  showsave: boolean;
  showtitle?: boolean;
};

type InputComponentRegistry = {
  [K in PlayerInputModel['type']]: Component<InputComponentProps<K>>;
};

// `satisfies` makes the type checker verify that every registered component
// accepts the common props (including `playerView`). If a component drops or
// renames a shared prop, this fails at compile time.
const inputComponents = {
  'and': AndOptions,
  'or': OrOptions,
  'amount': SelectAmount,
  'card': SelectCard,
  'colony': SelectColony,
  'delegate': SelectDelegate,
  'globalEvent': SelectGlobalEvent,
  'initialCards': SelectInitialCards,
  'option': SelectOption,
  'party': SelectParty,
  'payment': SelectPayment,
  'player': SelectPlayer,
  'projectCard': SelectProjectCardToPlay,
  'space': SelectSpace,
  'productionToLose': SelectProductionToLose,
  'aresGlobalParameters': ShiftAresGlobalParameters,
  'resource': SelectResource,
  'resources': SelectResources,
  'claimedUndergroundToken': SelectClaimedUndergroundToken,
  'deltaProject': DeltaProjectInput,
} satisfies InputComponentRegistry;

export default defineComponent({
  name: 'PlayerInputFactory',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
      required: true,
    },
    onsave: {
      type: Function as unknown as () => (out: InputResponse) => void,
      required: true,
    },
    showsave: {
      type: Boolean,
      required: true,
    },
    showtitle: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    saveData() {
      this.typedRefs.childInput.saveData();
    },
    canSave(): boolean {
      const canSave = this.typedRefs.childInput.canSave;
      return canSave ? canSave() : true;
    },
  },
  computed: {
    typedRefs(): {childInput: {saveData: () => void, canSave?: () => boolean}} {
      return this.$refs as unknown as {childInput: {saveData: () => void, canSave?: () => boolean}};
    },
    resolvedComponent(): Component {
      const input = this.playerinput;
      return inputComponents[input.type];
    },
  },
});
</script>
