<template>
  <div class="card-panel" v-if="message !== undefined">
    <AppButton size="big" type="close" :disableOnServerBusy="false" @click="hideMe" align="right"/>
    <div id="log_panel_card" class="cardbox" v-for="name in cards" :key="name">
      <Card :card="{name, isSelfReplicatingRobotsCard: isSelfReplicatingRobotsCard(name), resources: getResourcesOnCard(name)}"/>
    </div>
    <div id="log_panel_card" class="cardbox" v-for="name in globalEvents" :key="name">
      <global-event :globalEventName="name" type="prior" :showIcons="false"></global-event>
    </div>
    <div id="log_panel_card" class="cardbox" v-for="name in colonies" :key="name">
      <colony :colony="getColony(name)"></colony>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {CardName} from '@/common/cards/CardName';
import {ColonyName} from '@/common/colonies/ColonyName';
import {ColonyModel} from '@/common/models/ColonyModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import Card from '@/client/components/card/Card.vue';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import AppButton from '@/client/components/common/AppButton.vue';
import Colony from '@/client/components/colonies/Colony.vue';
import {deNull} from '@/common/utils/utils';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';

export default Vue.extend({
  name: 'log-panel',
  props: {
    message: Object as () => LogMessage | undefined,
    players: Array as () => Array<PublicPlayerModel>,
  },
  components: {
    AppButton,
    Card,
    Colony,
    GlobalEvent,
  },
  computed: {
    cards(): ReadonlyArray<CardName> {
      if (this.message === undefined) {
        return [];
      }
      const entries = this.message.data.map((datum) => datum.type === LogMessageDataType.CARD ? datum.value : undefined);
      return deNull(entries);
    },
    globalEvents(): Array<GlobalEventName> {
      if (this.message === undefined) {
        return [];
      }
      const entries = this.message.data.map((datum) => datum.type === LogMessageDataType.GLOBAL_EVENT ? datum.value : undefined);
      return deNull(entries);
    },
    colonies(): Array<ColonyName> {
      if (this.message === undefined) {
        return [];
      }
      const entries = this.message.data.map((datum) => datum.type === LogMessageDataType.COLONY ? datum.value : undefined);
      return deNull(entries);
    },
  },
  methods: {
    hideMe() {
      this.$emit('hide');
    },
    // TODO(kberg): getColony could have the actual game colony by changing this component's properties.
    getColony(name: ColonyName): ColonyModel {
      return {
        colonies: [],
        isActive: false,
        name: name,
        trackPosition: 0,
        visitor: undefined,
      };
    },
    isSelfReplicatingRobotsCard(cardName: CardName) {
      for (const player of this.players) {
        if (player.selfReplicatingRobotsCards.some((card) => card.name === cardName)) {
          return true;
        }
      }
      return false;
    },
    getResourcesOnCard(cardName: CardName) {
      for (const player of this.players) {
        const playedCard = player.tableau.find((card) => card.name === cardName);
        if (playedCard !== undefined) {
          return playedCard.resources;
        }
        const srrCard = player.selfReplicatingRobotsCards.find((card) => card.name === cardName);
        if (srrCard !== undefined) {
          return srrCard.resources;
        }
      }

      return undefined;
    },
  },
});

</script>
