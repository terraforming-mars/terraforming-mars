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
            <Button @click="saveData" :title="playerinput.buttonLabel" />
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Button from '@/client/components/common/Button.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import Party from '@/client/components/Party.vue';
import {PartyName} from '@/common/turmoil/PartyName';

export default Vue.extend({
  name: 'SelectPartyToSendDelegate',
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
  data() {
    return {
      selectedParty: undefined as string | undefined,
    };
  },
  components: {Button, Party},
  methods: {
    saveData() {
      const result: string[][] = [];
      result.push([]);
      if (this.selectedParty !== undefined) {
        result[0].push(this.selectedParty);
      }
      this.onsave(result);
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
