// Common code for SelectHowToPay and SelectHowToPayForProjectCard
import {CardName} from '@/CardName';
import {CardModel} from '@/models/CardModel';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import {PlayerViewModel} from '@/models/PlayerModel';
import {ResourceType} from '@/ResourceType';
import {Tags} from '@/cards/Tags';
import {Units} from '@/Units';

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
    science?: number; // Science isn't used in this component, but it simplifies testing.
    seeds?: number;
}

export interface SelectHowToPayForProjectCardModel extends SelectHowToPayModel {
  cardName: CardName;
  card: CardModel;
  cards: Array<CardModel>;
  tags: Array<Tags>
  science: number;
  seeds: number;
  available: Units;
}

export interface PaymentWidgetModel extends SelectHowToPayModel {
  cardName?: CardName;
  card?: CardModel;
  cards?: Array<CardModel>;
  tags?: Array<Tags>;
  available?: Units;
  $data: SelectHowToPayModel | SelectHowToPayForProjectCardModel;
  playerView: PlayerViewModel;
  playerinput: PlayerInputModel;
}

// https://steveholgado.com/typescript-types-from-arrays/
export const unit = ['megaCredits', 'titanium', 'steel', 'heat', 'microbes', 'floaters', 'science', 'seeds'] as const;
export type Unit = typeof unit[number];

export const PaymentWidgetMixin = {
  'name': 'PaymentWidgetMixin',
  'methods': {
    // Please don't copy this pattern. This
    // is being used as an interim solution
    // until there is better typing on the
    // SelectHowToPay components.
    asModel(): PaymentWidgetModel {
      return this as unknown as PaymentWidgetModel;
    },
    getMegaCreditsMax(): number {
      const model = this.asModel();
      return Math.min(model.playerView.thisPlayer.megaCredits, model.$data.cost);
    },
    getResourceRate(resourceName: Unit): number {
      switch (resourceName) {
      case 'titanium':
        return this.asModel().playerView.thisPlayer.titaniumValue;
      case 'steel':
        return this.asModel().playerView.thisPlayer.steelValue;
      case 'microbes':
        return 2;
      case 'floaters':
        return 3;
      case 'seeds':
        return 5;
      default:
        return 1;
      }
    },
    reduceValue(target: Unit, delta: number): void {
      const currentValue: number | undefined = this.asModel()[target];
      if (currentValue === undefined) {
        throw new Error(`can not reduceValue for ${target} on this`);
      }


      const adjustedDelta = Math.min(delta, currentValue);
      if (adjustedDelta === 0) return;
      this.asModel()[target] -= adjustedDelta;
      if (target !== 'megaCredits') this.setRemainingMCValue();
    },
    // max is the largest value this item can be. It's not the largest delta.
    addValue(target: Unit, delta: number, max?: number): void {
      const currentValue: number | undefined = this.asModel()[target];
      if (currentValue === undefined) {
        throw new Error(`can not addValue for ${target} on this`);
      }

      let maxValue: number | undefined = max !== undefined ? max : this.getAmount(target);
      // TODO(kberg): Remove this special code for MC?
      if (target === 'megaCredits') {
        maxValue = this.getMegaCreditsMax();
      }

      if (currentValue === maxValue) return;

      if (maxValue === undefined) {
        throw new Error(`unable to determine maxValue for ${target}`);
      }

      // const adjustedDelta = (currentValue + delta <= maxValue) ? delta : maxValue - currentValue;
      const adjustedDelta = Math.min(delta, maxValue - currentValue);
      if (adjustedDelta === 0) return;
      this.asModel()[target] += adjustedDelta;
      if (target !== 'megaCredits') this.setRemainingMCValue();
    },
    setRemainingMCValue(): void {
      const ta = this.asModel();

      let remainingMC = ta.$data.cost;

      for (const resource of unit) {
        if (resource === 'megaCredits') continue;

        const value = (ta[resource] ?? 0) * this.getResourceRate(resource);
        remainingMC -= value;
      }

      ta['megaCredits'] = Math.max(0, Math.min(this.getMegaCreditsMax(), remainingMC));
    },
    setMaxValue(target: Unit, max?: number): void {
      let currentValue: number | undefined = this.asModel()[target];
      if (currentValue === undefined) {
        throw new Error(`can not setMaxValue for ${target} on this`);
      }
      const cost: number = this.asModel().$data.cost;
      let amountNeed = cost;
      if (target !== 'science' && target !== 'heat') {
        amountNeed = Math.floor(cost / this.getResourceRate(target));
      }

      const amountHave: number = this.getAmount(target);

      while (currentValue < amountHave && currentValue < amountNeed) {
        this.addValue(target, 1, max);
        currentValue++;
      }
    },
    getAmount(target: Unit) {
      let amount: number | undefined = undefined;
      const model = this.asModel();
      switch (target) {
      case 'heat':
      case 'steel':
      case 'titanium':
      case 'megaCredits':
        amount = model.playerView.thisPlayer[target];
        break;

      case 'floaters':
      case 'microbes':
      case 'science':
      case 'seeds':
        amount = model.playerinput[target];
        break;
      };

      if (amount === undefined) {
        throw new Error(`unable to find amountHave for ${target}`);
      }

      if (target === 'floaters' && this.isStratosphericBirdsEdgeCase()) {
        amount--;
      }
      return amount;
    },
    isStratosphericBirdsEdgeCase(): boolean {
      if (this.asModel().$data.card?.name === CardName.STRATOSPHERIC_BIRDS) {
        const playedCards: Array<CardModel> = this.asModel().playerView.thisPlayer.playedCards;
        const cardsWithFloaters = playedCards.filter((card) => card.resourceType === ResourceType.FLOATER && card.resources);
        return cardsWithFloaters.length === 1;
      }
      return false;
    },
  },
};
