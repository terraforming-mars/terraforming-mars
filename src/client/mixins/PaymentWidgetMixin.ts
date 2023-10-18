// Common code for SelectPayment and SelectProjectCardToPlay
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';
import {SelectPaymentModel, SelectProjectCardToPlayModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Tag} from '@/common/cards/Tag';
import {Units} from '@/common/Units';
import {CardResource} from '@/common/CardResource';
import {getCard} from '@/client/cards/ClientCardManifest';
import {DEFAULT_PAYMENT_VALUES, PAYMENT_UNITS, Payment, PaymentUnit} from '@/common/inputs/Payment';

export type SelectPaymentDataModel = {
  card?: CardModel;
  cost: number;
  warning: string | undefined;
  payment: Payment;
}

export type SelectProjectCardToPlayDataModel = SelectPaymentDataModel & {
  // The cards to select from
  cards: Array<CardModel>;

  // Information about the currently selected card
  cardName: CardName;
  card: CardModel;
  reserveUnits: Units;
  tags: Array<Tag>;
  available: Units;
}

type PaymentWidgetModel = SelectPaymentDataModel & Partial<SelectProjectCardToPlayDataModel> & {
  playerView: PlayerViewModel;
  playerinput: SelectPaymentModel | SelectProjectCardToPlayModel;
}
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
    /**
     * Get the most MC needed for this purchase.
     *
     * If the player has enough MC to cover the cost, this returns the cost.
     * Otherwise, it returns player's MC. Other resources will be necessary to make up the cost.
     */
    getMegaCreditsMax(): number {
      const model = this.asModel();
      return Math.min(this.getAvailableUnits('megaCredits'), model.cost);
    },
    getResourceRate(unit: PaymentUnit): number {
      switch (unit) {
      case 'steel':
        return this.asModel().playerView.thisPlayer.steelValue;
      case 'titanium':
        return this.getTitaniumResourceRate();
      default:
        return DEFAULT_PAYMENT_VALUES[unit];
      }
    },
    getTitaniumResourceRate(): number {
      const paymentOptions = this.asModel().playerinput.paymentOptions;
      const titaniumValue = this.asModel().playerView.thisPlayer.titaniumValue;
      if (paymentOptions?.titanium !== true &&
        paymentOptions?.lunaTradeFederationTitanium === true) {
        return titaniumValue - 1;
      }
      return titaniumValue;
    },
    reduceValue(unit: PaymentUnit, delta: number): void {
      const currentValue: number | undefined = this.asModel().payment[unit];
      if (currentValue === undefined) {
        throw new Error(`can not reduceValue for ${unit} on this`);
      }

      const adjustedDelta = Math.min(delta, currentValue);
      if (adjustedDelta === 0) return;
      this.asModel().payment[unit] -= adjustedDelta;
      if (unit !== 'megaCredits') this.setRemainingMCValue();
    },
    // max is the largest value this item can be. It's not the largest delta.
    addValue(unit: PaymentUnit, delta: number, max?: number): void {
      const currentValue: number | undefined = this.asModel().payment[unit];
      if (currentValue === undefined) {
        throw new Error(`can not addValue for ${unit} on this`);
      }

      let maxValue: number = max ?? this.getAvailableUnits(unit);
      // TODO(kberg): Remove this special code for MC?
      if (unit === 'megaCredits') {
        maxValue = this.getMegaCreditsMax();
      }

      if (currentValue === maxValue) {
        return;
      }

      const adjustedDelta = Math.min(delta, maxValue - currentValue);
      if (adjustedDelta === 0) {
        return;
      }
      this.asModel().payment[unit] += adjustedDelta;
      if (unit !== 'megaCredits') {
        this.setRemainingMCValue();
      }
    },
    setRemainingMCValue(): void {
      const ta = this.asModel();

      let remainingMC = ta.cost;

      for (const resource of PAYMENT_UNITS) {
        if (resource === 'megaCredits') {
          continue;
        }
        const value = (ta.payment[resource] ?? 0) * this.getResourceRate(resource);
        remainingMC -= value;
      }

      ta.payment.megaCredits = Math.max(0, Math.min(this.getMegaCreditsMax(), remainingMC));
    },
    setMaxValue(unit: PaymentUnit, max?: number): void {
      let currentValue: number | undefined = this.asModel().payment[unit];
      if (currentValue === undefined) {
        throw new Error(`can not setMaxValue for ${unit} on this`);
      }
      const cost: number = this.asModel().cost;
      const resourceRate = this.getResourceRate(unit);
      const amountNeed = Math.floor(cost / resourceRate);
      const amountHave: number = this.getAvailableUnits(unit);

      while (currentValue < amountHave && currentValue < amountNeed) {
        this.addValue(unit, 1, max);
        currentValue++;
      }
    },
    // Perhaps this is unnecessary. It's just a >0 check.
    hasUnits(unit: PaymentUnit): boolean {
      return this.getAvailableUnits(unit) > 0;
    },
    getAvailableUnits(unit: PaymentUnit): number {
      let amount: number | undefined = undefined;
      const model = this.asModel();
      const thisPlayer = model.playerView.thisPlayer;
      switch (unit) {
      case 'heat':
        amount = this.availableHeat();
        break;

      case 'steel':
      case 'titanium':
      case 'megaCredits':
      case 'plants':
        amount = thisPlayer[unit];
        break;

      case 'floaters':
      case 'microbes':
      case 'lunaArchivesScience':
      case 'spireScience':
      case 'seeds':
      case 'auroraiData':
      case 'graphene':
      case 'kuiperAsteroids':
        // TODO(kberg): remove 'as any'. You can do it.
        amount = (model.playerinput as any)[unit];
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
      if (unit === 'floaters' && this.asModel().card?.name === CardName.STRATOSPHERIC_BIRDS) {
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
