// Common code for SelectPayment and SelectProjectCardToPlay
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Tag} from '@/common/cards/Tag';
import {Units} from '@/common/Units';
import {DATA_VALUE, SEED_VALUE} from '@/common/constants';
import {CardResource} from '@/common/CardResource';
import {getCard} from '../cards/ClientCardManifest';

export interface SelectPaymentModel {
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
    data?: number;
}

export interface SelectProjectCardToPlayModel extends SelectPaymentModel {
  cardName: CardName;
  card: CardModel;
  cards: Array<CardModel>;
  tags: Array<Tag>
  science: number;
  seeds: number;
  available: Units;
}

export interface PaymentWidgetModel extends SelectPaymentModel {
  cardName?: CardName;
  card?: CardModel;
  cards?: Array<CardModel>;
  tags?: Array<Tag>;
  available?: Units;
  $data: SelectPaymentModel | SelectProjectCardToPlayModel;
  playerView: PlayerViewModel;
  playerinput: PlayerInputModel;
}

// https://steveholgado.com/typescript-types-from-arrays/
export const unit = ['megaCredits', 'titanium', 'steel', 'heat', 'microbes', 'floaters', 'science', 'seeds', 'data'] as const;
export type Unit = typeof unit[number];

export const PaymentWidgetMixin = {
  name: 'PaymentWidgetMixin',
  methods: {
    // Please don't copy this pattern. This
    // is being used as an interim solution
    // until there is better typing on the
    // SelectPayment components.
    asModel(): PaymentWidgetModel {
      return this as unknown as PaymentWidgetModel;
    },
    getMegaCreditsMax(): number {
      const model = this.asModel();
      return Math.min(model.playerView.thisPlayer.megaCredits, model.cost);
    },
    canUseTitanium(): boolean {
      throw new Error('Should be overridden');
    },
    canUseLunaTradeFederationTitanium(): boolean {
      throw new Error('Should be overridden');
    },
    canUseLunaTradeFederationTitaniumOnly(): boolean {
      return this.canUseTitanium() !== true && this.canUseLunaTradeFederationTitanium();
    },
    getResourceRate(resourceName: Unit): number {
      switch (resourceName) {
      case 'titanium':
        const v = this.asModel().playerView.thisPlayer.titaniumValue;
        return this.canUseLunaTradeFederationTitaniumOnly() === true ? v - 1 : v;
      case 'steel':
        return this.asModel().playerView.thisPlayer.steelValue;
      case 'microbes':
        return 2;
      case 'floaters':
        return 3;
      case 'seeds':
        return SEED_VALUE;
      case 'data':
        return DATA_VALUE;
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
      const resourceRate = this.getResourceRate(target);
      const amountNeed = Math.floor(cost / resourceRate);
      const amountHave: number = this.getAmount(target);

      while (currentValue < amountHave && currentValue < amountNeed) {
        this.addValue(target, 1, max);
        currentValue++;
      }
    },
    getAmount(target: Unit): number {
      let amount: number | undefined = undefined;
      const model = this.asModel();
      const thisPlayer = model.playerView.thisPlayer;
      switch (target) {
      case 'heat':
        amount = this.availableHeat();
        break;

      case 'steel':
      case 'titanium':
      case 'megaCredits':
        amount = thisPlayer[target];
        break;

      case 'floaters':
      case 'microbes':
      case 'science':
      case 'seeds':
      case 'data':
        amount = model.playerinput[target];
        break;
      }

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
        // Find a card other than Dirigibles with floaters.
        // If there is none, then Dirigibles can't use every one.
        if (!thisPlayer.tableau.some((card) => {
          return card.name !== CardName.DIRIGIBLES && getCard(card.name)?.resourceType === CardResource.FLOATER && (card.resources ?? 0) > 0;
        })) {
          amount = Math.max(amount - 1, 0);
        }
      }
      return amount;
    },
    availableHeat(): number {
      const model = this.asModel();
      const thisPlayer = model.playerView.thisPlayer;
      const stormcraft = thisPlayer.tableau.find((card) => card.name === CardName.STORMCRAFT_INCORPORATED);
      if (stormcraft !== undefined && stormcraft.resources !== undefined) {
        return thisPlayer.heat + (stormcraft.resources * 2);
      }
      return thisPlayer.heat;
    },

  },
};
