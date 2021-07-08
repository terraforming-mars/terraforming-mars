// Common code for SelectHowToPay and SelectHowToPayForProjectCard
import {CardName} from '../CardName';
import {CardModel} from '../models/CardModel';
import {ResourceType} from '../ResourceType';

type ResourcesWithRates = 'titanium' | 'steel' | 'microbes' |'floaters';
export const PaymentWidgetMixin = {
  'name': 'PaymentWidgetMixin',
  'methods': {
    getMegaCreditsMax: function(): number {
      return Math.min((this as any).player.megaCredits, (this as any).$data.cost);
    },
    getResourceRate: function(resourceName: ResourcesWithRates): number {
      let rate = 1; // one resource == one money
      if (resourceName === 'titanium') {
        rate = (this as any).player.titaniumValue;
      } else if (resourceName === 'steel') {
        rate = (this as any).player.steelValue;
      } else if (resourceName === 'microbes') {
        rate = 2;
      } else if (resourceName === 'floaters') {
        rate = 3;
      }
      return rate;
    },
    reduceValue: function(target: string, to: number): void {
      const currentValue: number = (this as any)[target];

      if (currentValue === 0) return;

      const realTo = Math.min(to, currentValue);
      (this as any)[target] -= realTo;

      if (target === 'megaCredits' || realTo === 0) return;

      this.setRemainingMCValue();
    },
    addValue: function(target: string, to: number, max?: number): void {
      const currentValue: number = (this as any)[target];
      let maxValue: number = max ?? (this as any).player[target];

      if (target === 'megaCredits') {
        maxValue = this.getMegaCreditsMax();
      }

      if (target === 'microbes') maxValue = (this as any).playerinput.microbes;
      if (target === 'floaters') {
        maxValue = (this as any).playerinput.floaters;
        if (this.isStratosphericBirdsEdgeCase()) maxValue--;
      }
      if (target === 'science') maxValue = (this as any).playerinput.science;
      if (currentValue === maxValue) return;

      const realTo = (currentValue + to <= maxValue) ? to : maxValue - currentValue;
      (this as any)[target] += realTo;

      if (target === 'megaCredits' || realTo === 0) return;

      this.setRemainingMCValue();
    },
    setRemainingMCValue: function(): void {
      const ta = this as any;
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
      let currentValue: number = (this as any)[target];
      const cardCost: number = (this as any).$data.cost;
      let amountHave: number = max ?? (this as any).player[target];

      let amountNeed = cardCost;
      if (target !== 'science' && target !== 'heat') {
        amountNeed = Math.floor(cardCost / this.getResourceRate(target));
      }

      if (target === 'microbes') amountHave = (this as any).playerinput.microbes;
      if (target === 'floaters') {
        amountHave = (this as any).playerinput.floaters;
        if (this.isStratosphericBirdsEdgeCase()) amountHave--;
      }
      if (target === 'science') amountHave = (this as any).playerinput.science;

      while (currentValue < amountHave && currentValue < amountNeed) {
        this.addValue(target, 1, max);
        currentValue++;
      }
    },
    isStratosphericBirdsEdgeCase: function(): boolean {
      if ((this as any).$data.card.name === CardName.STRATOSPHERIC_BIRDS) {
        const playedCards = (this as any).player.playedCards as Array<CardModel>;
        const cardsWithFloaters = playedCards.filter((card) => card.resourceType === ResourceType.FLOATER && card.resources);
        return cardsWithFloaters.length === 1;
      }
      return false;
    },
  },
};
