import Vue from 'vue';

import {IProjectCard} from '../../cards/IProjectCard';
import {ICard} from '../../cards/ICard';
import {BeginnerCorporation} from '../../cards/corporation/BeginnerCorporation';
import {CardModel} from '../../models/CardModel';
import {CardTitle} from './CardTitle';
import {CardNumber} from './CardNumber';
import {CardResourceCounter} from './CardResourceCounter';
import {CardCost} from './CardCost';
import {CardExtraContent} from './CardExtraContent';
import {CardExpansion} from './CardExpansion';
import {CardTags} from './CardTags';
import {CardType} from '../../cards/CardType';
import {CardContent} from './CardContent';
import {CardMetadata} from '../../cards/CardMetadata';
import {Tags} from '../../cards/Tags';
import {
  ALL_CARD_MANIFESTS,
  ALL_CORPORATION_DECKS,
  ALL_PRELUDE_DECKS,
  ALL_PROJECT_DECKS,
  ALL_STANDARD_PROJECT_DECKS,
} from '../../cards/AllCards';
import {CardTypes, Deck, Decks} from '../../Deck';
import {GameModule} from '../../GameModule';

function getCorporationCardByName(cardName: string): ICard | undefined {
  if (cardName === new BeginnerCorporation().name) {
    return new BeginnerCorporation();
  }
  return Decks.findByName(ALL_CORPORATION_DECKS, cardName);
}

export function getProjectCardByName(cardName: string): IProjectCard | undefined {
  return Decks.findByName(ALL_PROJECT_DECKS.concat(ALL_PRELUDE_DECKS), cardName);
}

function getStandardProjectCardByName(cardName: string): ICard | undefined {
  return Decks.findByName(ALL_STANDARD_PROJECT_DECKS, cardName);
}

export function getCardExpansionByName(cardName: string): GameModule {
  const manifest = ALL_CARD_MANIFESTS.find((manifest) => {
    const decks: Array<Deck<CardTypes>> = [
      manifest.corporationCards,
      manifest.projectCards,
      manifest.preludeCards,
      manifest.standardProjects,
    ];
    return Decks.findByName(decks, cardName);
  });

  if (manifest === undefined) {
    throw new Error(`Can't find card ${cardName}`);
  }
  return manifest.module;
}

export const Card = Vue.component('card', {
  components: {
    CardTitle,
    CardResourceCounter,
    CardCost,
    CardExtraContent,
    CardExpansion,
    CardTags,
    CardContent,
    CardNumber,
  },
  props: {
    'card': {
      type: Object as () => ICard,
      required: true,
    },
    'actionUsed': {
      type: Boolean,
    },
  },
  methods: {
    getCardExpansion: function(): string {
      return getCardExpansionByName(this.card.name);
    },
    getCard: function(): ICard | undefined {
      return getProjectCardByName(this.card.name) || getCorporationCardByName(this.card.name) || getStandardProjectCardByName(this.card.name);
    },
    getTags: function(): Array<string> {
      let result: Array<string> = [];
      const type = this.getCardType();
      const tags = this.getCard()?.tags;
      if (tags !== undefined) {
        result = result.concat(tags);
      }
      if (type === CardType.EVENT) {
        result.push(Tags.EVENT);
      }

      return result;
    },
    getCost: function(): number | undefined {
      const cost = this.getCard()?.cost;
      const type = this.getCardType();
      return cost === undefined || type === CardType.PRELUDE ? undefined : cost;
    },
    getCardType: function(): CardType | undefined {
      return this.getCard()?.cardType;
    },
    getCardNumber: function(): string | undefined {
      return this.getCardMetadata()?.cardNumber;
    },
    getCardClasses: function(card: CardModel): string {
      const classes = ['card-container', 'filterDiv', 'hover-hide-res'];
      classes.push('card-' + card.name.toLowerCase().replace(/ /g, '-'));

      if (this.actionUsed) {
        classes.push('cards-action-was-used');
      }
      if (this.isStandardProject()) {
        classes.push('card-standard-project');
      }
      return classes.join(' ');
    },
    getCardMetadata: function(): CardMetadata | undefined {
      return this.getCard()?.metadata;
    },
    getResourceAmount: function(card: CardModel): number {
      return card.resources !== undefined ? card.resources : 0;
    },
    isCorporationCard: function() : boolean {
      return getCorporationCardByName(this.card.name) !== undefined;
    },
    isStandardProject: function() : boolean {
      return getStandardProjectCardByName(this.card.name) !== undefined;
    },
  },
  template: `
        <div :class="getCardClasses(card)">
            <div class="card-content-wrapper" v-i18n>
                <div v-if="!isStandardProject()" class="card-cost-and-tags">
                    <CardCost :amount="getCost()" />
                    <CardTags :tags="getTags()" />
                </div>
                <CardTitle :title="card.name" :type="getCardType()"/>

                <CardContent v-if="getCardMetadata() !== undefined" :metadata="getCardMetadata()"
                             :isStandardProject="isStandardProject()" :isCorporation="isCorporationCard()"/>
                <CardNumber v-if="getCardMetadata() !== undefined" :number="getCardNumber()" />
            </div>
            <CardExpansion :expansion="getCardExpansion()" :isCorporation="isCorporationCard()"/>
            <CardResourceCounter v-if="card.resources !== undefined" :amount="getResourceAmount(card)" />
            <CardExtraContent :card="card" />
        </div>
    `,
});
