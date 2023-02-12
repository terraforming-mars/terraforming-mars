<template>
<div class="player_home_block player_home_block--cards">
  <div class="hiding-card-button-row">
    <dynamic-title title="Played Cards" :color="thisPlayer.color" />
    <div class="played-cards-filters">
      <div :class="getHideButtonClass('ACTIVE')" v-on:click.prevent="toggle('ACTIVE')">
        <div class="played-cards-count">{{getCardsByType(thisPlayer.tableau, [CardType.ACTIVE]).length.toString()}}</div>
        <div class="played-cards-selection" v-i18n>{{ getToggleLabel('ACTIVE')}}</div>
      </div>
      <div :class="getHideButtonClass('AUTOMATED')" v-on:click.prevent="toggle('AUTOMATED')">
        <div class="played-cards-count">{{getCardsByType(thisPlayer.tableau, [CardType.AUTOMATED, CardType.PRELUDE]).length.toString()}}</div>
        <div class="played-cards-selection" v-i18n>{{ getToggleLabel('AUTOMATED')}}</div>
      </div>
      <div :class="getHideButtonClass('EVENT')" v-on:click.prevent="toggle('EVENT')">
        <div class="played-cards-count">{{getCardsByType(thisPlayer.tableau, [CardType.EVENT]).length.toString()}}</div>
        <div class="played-cards-selection" v-i18n>{{ getToggleLabel('EVENT')}}</div>
      </div>
    </div>
    <div class="text-overview" v-i18n>[ toggle cards filters ]</div>
  </div>
  <div v-for="card in getCardsByType(thisPlayer.tableau, [CardType.CORPORATION])" :key="card.name" class="cardbox">
      <Card :card="card" :actionUsed="isCardActivated(card, thisPlayer)"/>
  </div>
  <div v-for="card in getCardsByType(thisPlayer.tableau, [CardType.CEO])" :key="card.name" class="cardbox">
      <Card :card="card" :actionUsed="isCardActivated(card, thisPlayer)"/>
  </div>
  <div v-show="isVisible('ACTIVE')" v-for="card in sortActiveCards(getCardsByType(thisPlayer.tableau, [CardType.ACTIVE]))" :key="card.name" class="cardbox">
      <Card :card="card" :actionUsed="isCardActivated(card, thisPlayer)"/>
  </div>

  <StackedCards v-show="isVisible('AUTOMATED')" :cards="getCardsByType(thisPlayer.tableau, [CardType.AUTOMATED, CardType.PRELUDE])" />
  <StackedCards v-show="isVisible('EVENT')" :cards="getCardsByType(thisPlayer.tableau, [CardType.EVENT])" />


  <div v-if="thisPlayer.selfReplicatingRobotsCards.length > 0" class="player_home_block">
    <dynamic-title title="Self-Replicating Robots cards" :color="thisPlayer.color"/>
    <div>
      <div v-for="card in getCardsByType(thisPlayer.selfReplicatingRobotsCards, [CardType.ACTIVE])" :key="card.name" class="cardbox">
        <Card :card="card"/>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import Card from '@/client/components/card/Card.vue';
import {PlayerMixin} from '@/client/mixins/PlayerMixin';
import DynamicTitle from '@/client/components/common/DynamicTitle.vue';
import {getPreferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import StackedCards from '@/client/components/StackedCards.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {CardType} from '@/common/cards/CardType';

export interface PlayerHomeModel {
  showActiveCards: boolean;
  showAutomatedCards: boolean;
  showEventCards: boolean;
}

export default Vue.extend({
  name: 'played-cards',
  data(): PlayerHomeModel {
    const preferences = getPreferences();
    return {
      showActiveCards: !preferences.hide_active_cards,
      showAutomatedCards: !preferences.hide_automated_cards,
      showEventCards: !preferences.hide_event_cards,
    };
  },
  watch: {
    hide_active_cards() {
      PreferencesManager.INSTANCE.set('hide_active_cards', !this.showActiveCards);
    },
    hide_automated_cards() {
      PreferencesManager.INSTANCE.set('hide_automated_cards', !this.showAutomatedCards);
    },
    hide_event_cards() {
      PreferencesManager.INSTANCE.set('hide_event_cards', !this.showEventCards);
    },
  },
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
  },
  computed: {
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    CardType(): typeof CardType {
      return CardType;
    },
  },

  components: {
    Card,
    DynamicTitle,
    StackedCards,
  },
  mixins: [PlayerMixin],
  methods: {
    ...PlayerMixin.methods,
    toggle(type: string): void {
      switch (type) {
      case 'ACTIVE':
        this.showActiveCards = !this.showActiveCards;
        break;
      case 'AUTOMATED':
        this.showAutomatedCards = !this.showAutomatedCards;
        break;
      case 'EVENT':
        this.showEventCards = !this.showEventCards;
        break;
      }
    },
    isVisible(type: string): boolean {
      switch (type) {
      case 'ACTIVE':
        return this.showActiveCards;
      case 'AUTOMATED':
        return this.showAutomatedCards;
      case 'EVENT':
        return this.showEventCards;
      }
      return false;
    },
    getToggleLabel(hideType: string): string {
      if (hideType === 'ACTIVE') {
        return (this.showActiveCards? '✔' : '');
      } else if (hideType === 'AUTOMATED') {
        return (this.showAutomatedCards ? '✔' : '');
      } else if (hideType === 'EVENT') {
        return (this.showEventCards ? '✔' : '');
      } else {
        return '';
      }
    },
    getHideButtonClass(hideType: string): string {
      const prefix = 'hiding-card-button ';
      if (hideType === 'ACTIVE') {
        return prefix + (this.showActiveCards ? 'active' : 'active-transparent');
      } else if (hideType === 'AUTOMATED') {
        return prefix + (this.showAutomatedCards ? 'automated' : 'automated-transparent');
      } else if (hideType === 'EVENT') {
        return prefix + (this.showEventCards ? 'event' : 'event-transparent');
      } else {
        return '';
      }
    },
  },
});

</script>
