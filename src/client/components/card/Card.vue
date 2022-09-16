<template>
  <div :class="getCardClasses(card)">
      <div class="card-content-wrapper" v-i18n>
          <div v-if="!isStandardProject()" class="card-cost-and-tags">
              <CardCost :amount="getCost()" :newCost="getReducedCost()" />
              <card-help v-show="hasHelp" :name="card.name" />
              <CardTags :tags="getTags()" />
          </div>
          <CardTitle :title="card.name" :type="getCardType()"/>
          <CardContent v-if="getCardMetadata() !== undefined" :metadata="getCardMetadata()" :requirements="getCardRequirements()" :isCorporation="isCorporationCard()"/>
      </div>
      <CardExpansion :expansion="getCardExpansion()" :isCorporation="isCorporationCard()"/>
      <CardResourceCounter v-if="hasResourceType" :amount="getResourceAmount()" :type="resourceType" />
      <CardExtraContent :card="card" />
      <slot/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';

import {CardModel} from '@/common/models/CardModel';
import CardTitle from './CardTitle.vue';
import CardResourceCounter from './CardResourceCounter.vue';
import CardCost from './CardCost.vue';
import CardExtraContent from './CardExtraContent.vue';
import CardExpansion from './CardExpansion.vue';
import CardTags from './CardTags.vue';
import {CardType} from '@/common/cards/CardType';
import CardContent from './CardContent.vue';
import CardHelp from './CardHelp.vue';
import {ICardMetadata} from '@/common/cards/ICardMetadata';
import {ICardRequirements} from '@/common/cards/ICardRequirements';
import {Tag} from '@/common/cards/Tag';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {CardResource} from '@/common/CardResource';
import {getCardOrThrow} from '@/client/cards/ClientCardManifest';
import {CardName} from '@/common/cards/CardName';

const names = [
  CardName.BOTANICAL_EXPERIENCE,
  CardName.MARS_DIRECT,
  CardName.LUNA_ECUMENOPOLIS,
  CardName.ROBOTIC_WORKFORCE,
];

export default Vue.extend({
  name: 'Card',
  components: {
    CardTitle,
    CardHelp,
    CardResourceCounter,
    CardCost,
    CardExtraContent,
    CardExpansion,
    CardTags,
    CardContent,
  },
  props: {
    card: {
      type: Object as () => CardModel,
      required: true,
    },
    actionUsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    robotCard: {
      type: Object as () => CardModel | undefined,
      required: false,
    },
  },
  data() {
    const cardName = this.card.name;
    const card = getCardOrThrow(cardName);

    return {
      cardInstance: card,
    };
  },
  methods: {
    getCardExpansion(): string {
      return this.cardInstance.module;
    },
    getTags(): Array<string> {
      const type = this.getCardType();
      const tags = [...this.cardInstance.tags || []];
      tags.forEach((tag, idx) => {
        // Clone are changed on card implementations but that's not passed down directly through the
        // model, however, it sends down the `cloneTag` field. So this function does the substitution.
        if (tag === Tag.CLONE && this.card.cloneTag !== undefined) {
          tags[idx] = this.card.cloneTag;
        }
      });
      if (type === CardType.EVENT) {
        tags.push(Tag.EVENT);
      }
      return tags;
    },
    getCost(): number | undefined {
      const cost = this.cardInstance.cost;
      const type = this.getCardType();
      return cost === undefined || type === CardType.PRELUDE || type === CardType.CORPORATION ? undefined : cost;
    },
    getReducedCost(): number | undefined {
      const cost = this.card.calculatedCost;
      const type = this.getCardType();
      return cost === undefined || type === CardType.PRELUDE || type === CardType.CORPORATION ? undefined : cost;
    },
    getCardType(): CardType {
      return this.cardInstance.cardType;
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
      const learnerModeOff = !getPreferences().learner_mode;
      if (learnerModeOff && this.isStandardProject() && card.isDisabled) {
        classes.push('card-hide');
      }
      return classes.join(' ');
    },
    getCardMetadata(): ICardMetadata {
      return this.cardInstance.metadata;
    },
    getCardRequirements(): ICardRequirements | undefined {
      return this.cardInstance.requirements;
    },
    getResourceAmount(): number {
      return this.card.resources || this.robotCard?.resources || 0;
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
      return this.card.isSelfReplicatingRobotsCard === true || this.cardInstance.resourceType !== undefined || this.robotCard !== undefined;
    },
    resourceType(): CardResource {
      if (this.robotCard !== undefined || this.card.isSelfReplicatingRobotsCard === true) return CardResource.RESOURCE_CUBE;
      // This last RESOURCE_CUBE is functionally unnecessary and serves to satisfy the type contract.
      return this.cardInstance.resourceType ?? CardResource.RESOURCE_CUBE;
    },
    hasHelp(): boolean {
      return names.includes(this.card.name) && getPreferences().experimental_ui;
    },
  },
});

</script>
