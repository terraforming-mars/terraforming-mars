// Common code for SelectHowToPay and SelectHowToPayForProjectCard
import {CardName} from '../CardName';
import {CardModel} from '../models/CardModel';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerModel} from '../models/PlayerModel';
import {ResourceType} from '../ResourceType';
import {Tags} from '../cards/Tags';
import {Units} from '../Units';

export interface SelectHowToPayModel {
    card?: CardModel;
    cost: number;
    heat: number;
    megaCredits: number;
    steel: number;
    titanium: number;
    microbes: number;
    floaters: number;
    warning: string | undefined;
}

export interface SelectHowToPayForProjectCardModel extends SelectHowToPayModel {
  cardName: CardName;
  card: CardModel;
  cards: Array<CardModel>;
  tags: Array<Tags>
  science: number;
  available: Units;
}

interface PaymentWidgetModel extends SelectHowToPayModel {
  cardName?: CardName;
  card?: CardModel;
  cards?: Array<CardModel>;
  tags?: Array<Tags>;
  science?: number;
  available?: Units;
  $data: SelectHowToPayModel | SelectHowToPayForProjectCardModel;
  player: PlayerModel;
  playerinput: PlayerInputModel;
}

export const PaymentWidgetMixin = {
  'name': 'PaymentWidgetMixin',
  'methods': {
    getMegaCreditsMax: function(): number {
      return Math.min((this as unknown as PaymentWidgetModel).player.megaCredits, (this as unknown as PaymentWidgetModel).$data.cost);
    },
    getResourceRate: function(resourceName: 'steel' | 'titanium' | 'heat' | 'microbes' | 'floaters' | 'science'): number {
      let rate = 1; // one resource == one money
      if (resourceName === 'titanium') {
        rate = (this as unknown as PaymentWidgetModel).player.titaniumValue;
      } else if (resourceName === 'steel') {
        rate = (this as unknown as PaymentWidgetModel).player.steelValue;
      } else if (resourceName === 'microbes') {
        rate = 2;
      } else if (resourceName === 'floaters') {
        rate = 3;
      }
      return rate;
    },
    reduceValue: function(target: 'steel' | 'titanium' | 'heat' | 'megaCredits' | 'microbes' | 'floaters' | 'science', to: number): void {
      const currentValue: number | undefined = (this as unknown as PaymentWidgetModel)[target];

      if (currentValue === undefined) {
        throw new Error(`can not reduceValue for ${target} on this`);
      }

      if (currentValue === 0) return;

      const realTo = Math.min(to, currentValue);
      (this as unknown as PaymentWidgetModel)[target] -= realTo;

      if (target === 'megaCredits' || realTo === 0) return;

      this.setRemainingMCValue();
    },
    addValue: function(target: 'steel' | 'titanium' | 'heat' | 'megaCredits' | 'microbes' | 'floaters' | 'science', to: number, max?: number): void {
      const currentValue: number | undefined = (this as unknown as PaymentWidgetModel)[target];

      if (currentValue === undefined) {
        throw new Error(`can not addValue for ${target} on this`);
      }

      let maxValue: number | undefined = max;

      if (maxValue === undefined && target !== 'microbes' && target !== 'floaters' && target !== 'science') {
        maxValue = (this as unknown as PaymentWidgetModel).player[target];
      }

      if (target === 'megaCredits') {
        maxValue = this.getMegaCreditsMax();
      }

      if (target === 'microbes') maxValue = (this as unknown as PaymentWidgetModel).playerinput.microbes;
      if (target === 'floaters') {
        maxValue = (this as unknown as PaymentWidgetModel).playerinput.floaters;
        if (maxValue !== undefined && this.isStratosphericBirdsEdgeCase()) maxValue--;
      }
      if (target === 'science') maxValue = (this as unknown as PaymentWidgetModel).playerinput.science;
      if (currentValue === maxValue) return;

      if (maxValue === undefined) {
        throw new Error(`unable to determine maxValue for ${target}`);
      }

      const realTo = (currentValue + to <= maxValue) ? to : maxValue - currentValue;
      (this as unknown as PaymentWidgetModel)[target] += realTo;

      if (target === 'megaCredits' || realTo === 0) return;

      this.setRemainingMCValue();
    },
    setRemainingMCValue: function(): void {
      const remainingMC: number = (this as unknown as PaymentWidgetModel).$data.cost -
              (this as unknown as PaymentWidgetModel)['heat'] -
              (this as unknown as PaymentWidgetModel)['titanium'] * this.getResourceRate('titanium') -
              (this as unknown as PaymentWidgetModel)['steel'] * this.getResourceRate('steel') -
              (this as unknown as PaymentWidgetModel)['microbes'] * this.getResourceRate('microbes') -
              (this as unknown as PaymentWidgetModel)['floaters'] * this.getResourceRate('floaters') -
              ((this as unknown as PaymentWidgetModel)['science'] ?? 0);

      (this as unknown as PaymentWidgetModel)['megaCredits'] = Math.max(0, Math.min(this.getMegaCreditsMax(), remainingMC));
    },
    setMaxValue: function(target: 'steel' | 'titanium' | 'heat' | 'microbes' | 'floaters' | 'science', max?: number): void {
      let currentValue: number | undefined = (this as unknown as PaymentWidgetModel)[target];
      if (currentValue === undefined) {
        throw new Error(`can not setMaxValue for ${target} on this`);
      }
      const cardCost: number = (this as unknown as PaymentWidgetModel).$data.cost;
      let amountHave: number | undefined = max;
      if (max === undefined && target !== 'microbes' && target !== 'floaters' && target !== 'science') {
        amountHave = (this as unknown as PaymentWidgetModel).player[target];
      }

      let amountNeed: number = cardCost;
      if (['titanium', 'steel', 'microbes', 'floaters'].includes(target)) {
        amountNeed = Math.floor(cardCost/this.getResourceRate(target));
      }

      if (target === 'microbes') amountHave = (this as unknown as PaymentWidgetModel).playerinput.microbes;
      if (target === 'floaters') {
        amountHave = (this as unknown as PaymentWidgetModel).playerinput.floaters;
        if (amountHave !== undefined && this.isStratosphericBirdsEdgeCase()) amountHave--;
      }
      if (target === 'science') amountHave = (this as unknown as PaymentWidgetModel).playerinput.science;

      if (amountHave === undefined) {
        throw new Error(`unable to find amountHave for setMaxValue for ${target}`);
      }

      while (currentValue < amountHave && currentValue < amountNeed) {
        this.addValue(target, 1, max);
        currentValue++;
      }
    },
    isStratosphericBirdsEdgeCase: function(): boolean {
      if ((this as unknown as PaymentWidgetModel).$data.card?.name === CardName.STRATOSPHERIC_BIRDS) {
        const playedCards = (this as unknown as PaymentWidgetModel).player.playedCards as Array<CardModel>;
        const cardsWithFloaters = playedCards.filter((card) => card.resourceType === ResourceType.FLOATER && card.resources);
        return cardsWithFloaters.length === 1;
      }
      return false;
    },
  },
};
