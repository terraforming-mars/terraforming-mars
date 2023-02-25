<template>
    <div class="wf-component wf-component--select-party">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <div class="wf-component--list-party" v-if="playerinput.turmoil !== undefined">
          <label v-for="party in playerinput.turmoil.parties" :key="party.name">
              <input type="radio" v-model="selectedParty" :value="party.name" v-if="partyAvailableToSelect(party.name)"/>
              <Party :party="party" :isDominant="isDominant(party.name)" :isAvailable="partyAvailableToSelect(party.name)"/>
          </label>
        </div>
        <div v-if="showsave === true" class="nofloat">
            <AppButton @click="saveData" :title="playerinput.buttonLabel" />
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import Party from '@/client/components/Party.vue';
import {PartyName} from '@/common/turmoil/PartyName';
import {SelectPartyResponse} from '@/common/inputs/InputResponse';

export default Vue.extend({
  name: 'SelectPartyToSendDelegate',
  props: {
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectPartyResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data() {
    return {
      selectedParty: undefined as PartyName | undefined,
    };
  },
  components: {
    AppButton,
    Party,
  },
  methods: {
    saveData() {
      this.onsave({type: 'party', partyName: this.selectedParty});
    },
    isDominant(partyName: PartyName): boolean {
      return partyName === this.playerinput.turmoil?.dominant;
    },
    partyAvailableToSelect(partyName: PartyName): boolean {
      if (this.playerinput.availableParties === undefined) {
        return false;
      } else {
        return this.playerinput.availableParties.includes(partyName);
      }
    },
  },
});
</script>
