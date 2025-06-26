<template>
    <div class="player-allied-party">
        <div v-if="player.alliedParty" class='allied-policy-block'>
            <AlliedPartyAgenda :id="player.alliedParty.agenda.policyId"></AlliedPartyAgenda>
        </div>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import AlliedPartyAgenda from '@/client/components/turmoil/AlliedPartyAgenda.vue';

export default Vue.extend({
  name: 'PlayerAlliedParty',
  props: {
    player: {
      type: Object as () => PublicPlayerModel,
    },
  },
  components: {
    AlliedPartyAgenda,
  },
});

</script>
