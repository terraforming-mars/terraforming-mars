<template>
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
            <CardResourceCounter v-if="hasResourceType" :amount="getResourceAmount(card)" :type="resourceType" />
            <CardExtraContent :card="card" />
            <slot/>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';

import {ICard} from '@/cards/ICard';
import {CardModel} from '@/common/models/CardModel';
import CardTitle from './CardTitle.vue';
import CardNumber from './CardNumber.vue';
import CardResourceCounter from './CardResourceCounter.vue';
import CardCost from './CardCost.vue';
import CardExtraContent from './CardExtraContent.vue';
import CardExpansion from './CardExpansion.vue';
import CardTags from './CardTags.vue';
import {CardType} from '@/common/cards/CardType';
import CardContent from './CardContent.vue';
import {ICardMetadata} from '@/cards/ICardMetadata';
import {Tags} from '@/common/cards/Tags';
import {CardRequirements} from '@/cards/CardRequirements';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {ResourceType} from '@/common/ResourceType';
import {getCard} from '@/client/cards/ClientCardManifest';

export default Vue.extend({
  name: 'Card',
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
      required: false,
      default: false,
    },
  },
  data() {
    const cardName = this.card.name;
    const cam = getCard(cardName);
    if (cam === undefined) {
      throw new Error(`Can't find card ${cardName}`);
    }

    return {
      cardInstance: cam.card,
      expansion: cam.module,
    };
  },
  methods: {
    getCardExpansion(): string {
      return this.expansion;
    },
    getCard(): ICard | undefined {
      return this.cardInstance;
    },
    getTags(): Array<string> {
      const type = this.getCardType();
      const tags = [...this.getCard()?.tags || []];
      tags.forEach((tag, idx) => {
        // Clone are changed on card implementations but that's not passed down directly through the
        // model, however, it sends down the `cloneTag` field. So this function does the substitution.
        if (tag === Tags.CLONE && this.card.cloneTag !== undefined) {
          tags[idx] = this.card.cloneTag;
        }
      });
      if (type === CardType.EVENT) {
        tags.push(Tags.EVENT);
      }
      return tags;
    },
    getCost(): number | undefined {
      const cost = this.getCard()?.cost;
      const type = this.getCardType();
      return cost === undefined || type === CardType.PRELUDE || type === CardType.CORPORATION ? undefined : cost;
    },
    getReducedCost(): number | undefined {
      const cost = this.card.calculatedCost;
      const type = this.getCardType();
      return cost === undefined || type === CardType.PRELUDE || type === CardType.CORPORATION ? undefined : cost;
    },
    getCardType(): CardType | undefined {
      return this.getCard()?.cardType;
    },
    getCardNumber(): string {
      return String(this.getCardMetadata()?.cardNumber);
    },
    getCardClasses(card: CardModel): string {
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
    getCardMetadata(): ICardMetadata | undefined {
      return this.getCard()?.metadata;
    },
    getCardRequirements(): CardRequirements | undefined {
      return this.getCard()?.requirements;
    },
    getResourceAmount(card: CardModel): number {
      return card.resources !== undefined ? card.resources : 0;
    },
    isCorporationCard() : boolean {
      return this.getCardType() === CardType.CORPORATION;
    },
    isStandardProject() : boolean {
      return this.getCardType() === CardType.STANDARD_PROJECT || this.getCardType() === CardType.STANDARD_ACTION;
    },
  },
  computed: {
    hasResourceType(): boolean {
      return this.card.resourceType !== undefined || this.cardInstance.resourceType !== undefined;
    },
    resourceType(): ResourceType {
      if (this.card.resourceType !== undefined) return this.card.resourceType;
      if (this.cardInstance.resourceType !== undefined) return this.cardInstance.resourceType;
      return ResourceType.RESOURCE_CUBE;
    },
  },
});

</script>
