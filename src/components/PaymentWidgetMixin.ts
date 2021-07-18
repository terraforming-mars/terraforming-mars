// Common code for SelectHowToPay and SelectHowToPayForProjectCard
import {CardName} from '../CardName';
import {CardModel} from '../models/CardModel';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerViewModel} from '../models/PlayerModel';
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
    microbes: number; // Microbes are not actually used in this component. It's just to satisfy the mixin.
    floaters: number; // Floaters are not actually used in this component. It's just to satisfy the mixin.
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
  player: PlayerViewModel;
  playerinput: PlayerInputModel;
}

type ResourcesWithRates = 'titanium' | 'steel' | 'microbes' |'floaters';
export const PaymentWidgetMixin = {
  'name': 'PaymentWidgetMixin',
  'methods': {
    // Please don't copy this pattern. This
    // is being used as an interim solution
    // until there is better typing on the
    // SelectHowToPay components.
    asModel: function(): PaymentWidgetModel {
      return this as unknown as PaymentWidgetModel;
    },
    getMegaCreditsMax: function(): number {
      const model = this.asModel();
      return Math.min(model.player.megaCredits, model.$data.cost);
    },
    getResourceRate: function(resourceName: ResourcesWithRates): number {
      let rate = 1; // one resource == one money
      if (resourceName === 'titanium') {
        rate = this.asModel().player.titaniumValue;
      } else if (resourceName === 'steel') {
        rate = this.asModel().player.steelValue;
      } else if (resourceName === 'microbes') {
        rate = 2;
      } else if (resourceName === 'floaters') {
        rate = 3;
      }
      return rate;
    },
    reduceValue: function(target: ResourcesWithRates | 'heat' | 'megaCredits' | 'science', to: number): void {
      const currentValue: number | undefined = this.asModel()[target];

      if (currentValue === undefined) {
        throw new Error(`can not reduceValue for ${target} on this`);
      }

      if (currentValue === 0) return;

      const realTo = Math.min(to, currentValue);
      this.asModel()[target] -= realTo;

      if (target === 'megaCredits' || realTo === 0) return;

      this.setRemainingMCValue();
    },
    addValue: function(target: ResourcesWithRates | 'heat' | 'megaCredits' | 'science', to: number, max?: number): void {
      const currentValue: number | undefined = this.asModel()[target];

      if (currentValue === undefined) {
        throw new Error(`can not addValue for ${target} on this`);
      }

      let maxValue: number | undefined = max;

      if (maxValue === undefined && target !== 'microbes' && target !== 'floaters' && target !== 'science') {
        maxValue = this.asModel().player[target];
      }

      switch (target) {
      case 'megaCredits':
        maxValue = this.getMegaCreditsMax();
        break;
      case 'microbes':
        maxValue = this.asModel().playerinput.microbes;
        break;
      case 'floaters':
        maxValue = this.asModel().playerinput.floaters;
        if (maxValue !== undefined && this.isStratosphericBirdsEdgeCase()) maxValue--;
        break;
      case 'science':
        maxValue = this.asModel().playerinput.science;
        break;
      }

      if (currentValue === maxValue) return;

      if (maxValue === undefined) {
        throw new Error(`unable to determine maxValue for ${target}`);
      }

      const realTo = (currentValue + to <= maxValue) ? to : maxValue - currentValue;
      this.asModel()[target] += realTo;

      if (target === 'megaCredits' || realTo === 0) return;

      this.setRemainingMCValue();
    },
    setRemainingMCValue: function(): void {
      const ta = this.asModel();
      const heatMc = ta['heat'] ?? 0;
      const titaniumMc = (ta['titanium'] ?? 0) * this.getResourceRate('titanium');
      const steelMc = (ta['steel'] ?? 0) * this.getResourceRate('steel');
      const microbesMc = (ta['microbes'] ?? 0) * this.getResourceRate('microbes');
      const floatersMc = (ta['floaters'] ?? 0) * this.getResourceRate('floaters');
      const scienceMc = ta['science'] ?? 0;

      const remainingMC: number =
          ta.$data.cost - heatMc - titaniumMc - steelMc - microbesMc - floatersMc - scienceMc;

      ta['megaCredits'] = Math.max(0, Math.min(this.getMegaCreditsMax(), remainingMC));
    },
    setMaxValue: function(target: ResourcesWithRates | 'science' | 'heat', max?: number): void {
      let currentValue: number | undefined = this.asModel()[target];
      if (currentValue === undefined) {
        throw new Error(`can not setMaxValue for ${target} on this`);
      }
      const cardCost: number = this.asModel().$data.cost;
      let amountHave: number | undefined = max;
      if (max === undefined && target !== 'microbes' && target !== 'floaters' && target !== 'science') {
        amountHave = this.asModel().player[target];
      }

      let amountNeed = cardCost;
      if (target !== 'science' && target !== 'heat') {
        amountNeed = Math.floor(cardCost / this.getResourceRate(target));
      }

      if (target === 'microbes') amountHave = this.asModel().playerinput.microbes;
      if (target === 'floaters') {
        amountHave = this.asModel().playerinput.floaters;
        if (amountHave !== undefined && this.isStratosphericBirdsEdgeCase()) amountHave--;
      }
      if (target === 'science') amountHave = this.asModel().playerinput.science;

      if (amountHave === undefined) {
        throw new Error(`unable to find amountHave for setMaxValue for ${target}`);
      }

      while (currentValue < amountHave && currentValue < amountNeed) {
        this.addValue(target, 1, max);
        currentValue++;
      }
    },
    isStratosphericBirdsEdgeCase: function(): boolean {
      if (this.asModel().$data.card?.name === CardName.STRATOSPHERIC_BIRDS) {
        const playedCards = this.asModel().player.playedCards as Array<CardModel>;
        const cardsWithFloaters = playedCards.filter((card) => card.resourceType === ResourceType.FLOATER && card.resources);
        return cardsWithFloaters.length === 1;
      }
      return false;
    },
  },
};
