import Vue from 'vue';
import {Button} from '../components/common/Button';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {Party} from '../components/Party';
import {TranslateMixin} from './TranslateMixin';
import {PartyName} from '../turmoil/parties/PartyName';

export const SelectPartyToSendDelegate = Vue.component('select-party-to-send-delegate', {
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
  data: function() {
    return {
      selectedParty: undefined as string | undefined,
    };
  },
  components: {Button, Party},
  mixins: [TranslateMixin],
  methods: {
    saveData: function() {
      const result: string[][] = [];
      result.push([]);
      if (this.selectedParty !== undefined) {
        result[0].push(this.selectedParty);
      }
      this.onsave(result);
    },
    isDominant: function(partyName: PartyName): boolean {
      return partyName === this.playerinput.turmoil?.dominant;
    },
    partyAvailableToSelect: function(partyName: PartyName): boolean {
      if (this.playerinput.availableParties === undefined) {
        return false;
      } else {
        return this.playerinput.availableParties.includes(partyName);
      }
    },
  },
  template: `
    <div class="wf-component wf-component--select-party">
        <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
        <div class="wf-component--list-party">
          <label v-for="party in playerinput.turmoil.parties" :key="party.name">
              <input type="radio" v-model="selectedParty" :value="party.name" v-if="partyAvailableToSelect(party.name)"/>
              <party :party="party" :isDominant="isDominant(party.name)" :isAvailable="partyAvailableToSelect(party.name)"/>
          </label>
        </div>
        <div v-if="showsave === true" class="nofloat">
            <Button :onClick="saveData" :title="playerinput.buttonLabel" /> 
        </div>
    </div>
    `,
});
