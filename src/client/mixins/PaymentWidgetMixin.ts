// Common code for SelectHowToPay and SelectHowToPayForProjectCard
import {CardName} from '@/CardName';
import {CardModel} from '@/models/CardModel';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import {PlayerViewModel} from '@/models/PlayerModel';
import {Tags} from '@/common/cards/Tags';
import {Units} from '@/Units';
import {SEED_VALUE} from '@/constants';

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
        return SEED_VALUE;
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
    getAmount(target: Unit): number {
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
        return 0;
      }

      // Stratospheric Birds requires discarding one floater from any card.
      // That the card being paid for by the client shows that there's already a spare floater around, and
      // that the server has decided there's enough money to play it.
      //
      // The only floaters that can be used for payment are those on Dirigibles.
      // If you don't have Dirigibles but are still paying for S. Birds,
      // then amount, below would be -1, so the Math.max makes sure it's zero.

      // BTW, this could be managed by some derivative of reserveUnits that took extended resources into account.
      if (target === 'floaters' && this.asModel().$data.card?.name === CardName.STRATOSPHERIC_BIRDS) {
        amount = Math.max(amount - 1, 0);
      }
      return amount;
    },
  },
};
