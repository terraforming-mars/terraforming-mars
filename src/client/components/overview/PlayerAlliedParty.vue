<template>
    <div class="player-allied-party">
        <div v-if="player.alliedParty" class='allied-policy-block'>
            <div :class="'party-name party-name--'+partyNameToCss(player.alliedParty.partyName)" v-i18n>{{player.alliedParty.partyName}}</div>
            <agendas type="policy-bonus" :id="player.alliedParty.agenda.policyId"></agendas>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {vueRoot} from '@/client/components/vueRoot';
import Agendas from '@/client/components/turmoil/Agendas.vue';
import {PartyName} from '@/common/turmoil/PartyName';
import {PublicPlayerModel} from '@/common/models/PlayerModel';

export default Vue.extend({
  name: 'playerAlliedParty',
  props: {
    player: {
      type: Object as () => PublicPlayerModel,
    },
  },
  methods: {
    partyNameToCss(party: PartyName | undefined): string {
      if (party === undefined) {
        console.warn('no party provided');
        return '';
      }
      return party.toLowerCase().split(' ').join('_');
    },
    toggleMe() {
      const currentState: boolean = this.isVisible();
      vueRoot(this).setVisibilityState('allied_party', ! currentState);
    },
    isVisible() {
      return vueRoot(this).getVisibilityState('allied_party');
    },
  },
  components: {
    'agendas': Agendas,
  },
});

</script>
