<template>
    <div class="wf-component wf-component--select-party">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <div class="wf-component--list-party" v-if="turmoil !== undefined">
          <label v-for="party in turmoil.parties" :key="party.name">
              <input type="radio" v-model="selectedParty" :value="party.name" v-if="partyAvailableToSelect(party.name)"/>
              <Party :party="party" :isDominant="isDominant(party.name)" :isAvailable="partyAvailableToSelect(party.name)"/>
          </label>
        </div>
        <div v-if="showsave === true" class="nofloat">
            <AppButton @click="saveData" :title="playerinput.buttonLabel" />
        </div>
    </div>
</template>
<script setup lang="ts">
import {ref, computed} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectPartyModel} from '@/common/models/PlayerInputModel';
import Party from '@/client/components/Party.vue';
import {PartyName} from '@/common/turmoil/PartyName';
import {SelectPartyResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {TurmoilModel} from '@/common/models/TurmoilModel';

const props = defineProps<{
  playerView: PlayerViewModel;
  playerinput: SelectPartyModel;
  onsave: (out: SelectPartyResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const selectedParty = ref<PartyName | undefined>(undefined);

const turmoil = computed((): TurmoilModel | undefined => {
  return props.playerView.game.turmoil;
});

function saveData() {
  if (selectedParty.value === undefined) {
    return;
  }
  props.onsave({type: 'party', partyName: selectedParty.value});
}

function isDominant(partyName: PartyName): boolean {
  return partyName === turmoil.value?.dominant;
}

function partyAvailableToSelect(partyName: PartyName): boolean {
  if (props.playerinput.parties === undefined) {
    return false;
  } else {
    return props.playerinput.parties.includes(partyName);
  }
}
</script>
