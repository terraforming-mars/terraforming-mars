<template>
    <div class="player-allied-party">
        <div v-if="player.alliedParty" class='allied-policy-block'>
            <TurmoilAgenda :id="player.alliedParty.agenda.policyId" :show-party-badge="true"/>
        </div>
    </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';

export default defineComponent({
  name: 'PlayerAlliedParty',
  props: {
    player: {
      type: Object as () => PublicPlayerModel,
      required: true,
    },
  },
  components: {
    TurmoilAgenda,
  },
});

</script>
