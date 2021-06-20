import Vue from 'vue';

import {ICard} from '../../cards/ICard';
import {CardModel} from '../../models/CardModel';
import CardTitle from './CardTitle.vue';
import {CardNumber} from './CardNumber';
import {CardResourceCounter} from './CardResourceCounter';
import CardCost from './CardCost.vue';
import {CardExtraContent} from './CardExtraContent';
import {CardExpansion} from './CardExpansion';
import CardTags from './CardTags.vue';
import {CardType} from '../../cards/CardType';
import CardContent from './CardContent.vue';
import {CardMetadata} from '../../cards/CardMetadata';
import {Tags} from '../../cards/Tags';
import {ALL_CARD_MANIFESTS} from '../../cards/AllCards';
import {GameModule} from '../../GameModule';
import {CardRequirements} from '../../cards/CardRequirements';
import {PreferencesManager} from '../PreferencesManager';
import {OwnerModel} from '../../components/SelectCard';


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
      type: Object as () => CardModel,
      required: true,
    },
    'actionUsed': {
      type: Boolean,
    },
    'owner': {
      type: Object as () => OwnerModel | undefined,
    },
  },
  data: function() {
    let cardInstance: ICard | undefined;
    const cardName = this.card.name;
    let expansion: GameModule | undefined;
    for (const manifest of ALL_CARD_MANIFESTS) {
      const decks = [
        manifest.corporationCards,
        manifest.projectCards,
        manifest.preludeCards,
        manifest.standardProjects,
        manifest.standardActions,
      ];
      for (const deck of decks) {
        const factory = deck.findByCardName(cardName);
        if (factory !== undefined) {
          cardInstance = new factory.Factory();
          expansion = manifest.module;
          break;
        }
      }
      if (expansion !== undefined) {
        break;
      }
    }

    if (cardInstance === undefined || expansion === undefined) {
      throw new Error(`Can't find card ${cardName}`);
    }

    return {
      cardInstance,
      expansion,
    };
  },
  methods: {
    getCardExpansion: function(): string {
      return this.expansion;
    },
    getCard: function(): ICard | undefined {
      return this.cardInstance;
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
      return cost === undefined || type === CardType.PRELUDE || type === CardType.CORPORATION ? undefined : cost;
    },
    getReducedCost: function(): number | undefined {
      const cost = this.card.calculatedCost;
      const type = this.getCardType();
      return cost === undefined || type === CardType.PRELUDE || type === CardType.CORPORATION ? undefined : cost;
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

      if (this.actionUsed || card.isDisabled) {
        classes.push('card-unavailable');
      }
      if (this.isStandardProject()) {
        classes.push('card-standard-project');
      }
      const learnerModeOff = PreferencesManager.load('learner_mode') === '0';
      if (learnerModeOff && this.isStandardProject() && card.isDisabled) {
        classes.push('card-hide');
      }
      return classes.join(' ');
    },
    getCardMetadata: function(): CardMetadata | undefined {
      return this.getCard()?.metadata;
    },
    getCardRequirements: function(): CardRequirements | undefined {
      return this.getCard()?.requirements;
    },
    getResourceAmount: function(card: CardModel): number {
      return card.resources !== undefined ? card.resources : 0;
    },
    isCorporationCard: function() : boolean {
      return this.getCardType() === CardType.CORPORATION;
    },
    isStandardProject: function() : boolean {
      return this.getCardType() === CardType.STANDARD_PROJECT || this.getCardType() === CardType.STANDARD_ACTION;
    },
  },
  template: `
        <div :class="getCardClasses(card)">
            <div class="card-content-wrapper" v-i18n>
                <div v-if="!isStandardProject()" class="card-cost-and-tags">
                    <CardCost :amount="getCost()" :newCost="getReducedCost()" />
                    <CardTags :tags="getTags()" />
                </div>
                <CardTitle :title="card.name" :type="getCardType()"/>
                <CardContent v-if="getCardMetadata() !== undefined" :metadata="getCardMetadata()" :requirements="getCardRequirements()" :isCorporation="isCorporationCard()"/>
                <CardNumber v-if="getCardMetadata() !== undefined" :number="getCardNumber()"/>
            </div>
            <CardExpansion :expansion="getCardExpansion()" :isCorporation="isCorporationCard()"/>
            <CardResourceCounter v-if="card.resources !== undefined" :amount="getResourceAmount(card)" />
            <CardExtraContent :card="card" />
            <template v-if="owner !== undefined">
              <div :class="'card-owner-label player_translucent_bg_color_'+ owner.color">
                {{owner.name}}
              </div>
            </template>
        </div>
    `,
});
