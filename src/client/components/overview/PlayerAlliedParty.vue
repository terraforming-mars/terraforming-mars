<template>
    <div class="player-allied-party">
        <div v-if="player.alliedParty" class='allied-policy-block'>
            <agendas :id="player.alliedParty.agenda.policyId" :partyName="player.alliedParty.partyName"></agendas>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {vueRoot} from '@/client/components/vueRoot';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import AlliedPartyAgenda from '@/client/components/turmoil/AlliedPartyAgenda.vue';

export default Vue.extend({
  name: 'playerAlliedParty',
  props: {
    player: {
      type: Object as () => PublicPlayerModel,
    },
  },
  methods: {
    toggleMe() {
      const currentState: boolean = this.isVisible();
      vueRoot(this).setVisibilityState('allied_party', ! currentState);
    },
    isVisible() {
      return vueRoot(this).getVisibilityState('allied_party');
    },
  },
  components: {
    'agendas': AlliedPartyAgenda,
  },
});

</script>
