// Common code for SelectPayment and SelectProjectCardToPlay
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';
import {SelectPaymentModel, SelectProjectCardToPlayModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Tag} from '../../common/cards/Tag';
import {Units} from '@/common/Units';
import {CardResource} from '@/common/CardResource';
import {getCard} from '@/client/cards/ClientCardManifest';
import {DEFAULT_PAYMENT_VALUES, Payment} from '@/common/inputs/Payment';
import {SPENDABLE_RESOURCES, SpendableResource} from '@/common/inputs/Spendable';

export type SelectPaymentDataModel = {
  card?: CardModel;
  cost: number;
  warning: string | undefined;
  payment: Payment;
}

export type SelectProjectCardToPlayDataModel = SelectPaymentDataModel & {
  // The cards to select from
  cards: ReadonlyArray<CardModel>;

  // Information about the currently selected card
  cardName: CardName;
  card: CardModel;
  reserveUnits: Units;
  tags: Array<Tag>;
  available: Omit<Units, 'megacredits' | 'energy'>;
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
    getResourceRate(unit: SpendableResource): number {
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
    /**
     * Reduce `unit` by one.
     */
    reduceValue(unit: SpendableResource): void {
      const currentValue: number | undefined = this.asModel().payment[unit];
      if (currentValue === undefined) {
        throw new Error(`can not reduceValue for ${unit} on this`);
      }

      const adjustedDelta = Math.min(1, currentValue);
      if (adjustedDelta === 0) return;
      this.asModel().payment[unit] -= adjustedDelta;
      if (unit !== 'megaCredits') this.setRemainingMCValue();
    },
    /**
     * Increase `unit` by one.
     */
    addValue(unit: SpendableResource): void {
      const currentValue: number | undefined = this.asModel().payment[unit];
      if (currentValue === undefined) {
        throw new Error(`can not addValue for ${unit} on this`);
      }

      // Maxiumum value for this unit.
      // MC has a special-case because the max isn't how many MC the player has,
      // but how much they need to spend.
      const maxValue =
        unit === 'megaCredits' ?
          this.getMegaCreditsMax() :
          this.getAvailableUnits(unit);

      if (currentValue === maxValue) {
        return;
      }

      // addValue used to take a delta parameter, but now add only goes up by one.
      // This Math.min is probably no longer necessary.
      const delta = Math.min(1, maxValue - currentValue);
      if (delta === 0) {
        return;
      }
      this.asModel().payment[unit] += delta;
      if (unit !== 'megaCredits') {
        this.setRemainingMCValue();
      }
    },
    setRemainingMCValue(): void {
      const ta = this.asModel();

      let remainingMC = ta.cost;

      for (const resource of SPENDABLE_RESOURCES) {
        if (resource === 'megaCredits') {
          continue;
        }
        const value = (ta.payment[resource] ?? 0) * this.getResourceRate(resource);
        remainingMC -= value;
      }
      ta.payment.megaCredits = Math.max(0, Math.min(this.getMegaCreditsMax(), remainingMC));
    },
    setMaxValue(unit: SpendableResource): void {
      let currentValue: number | undefined = this.asModel().payment[unit];
      if (currentValue === undefined) {
        throw new Error(`can not setMaxValue for ${unit} on this`);
      }
      const cost: number = this.asModel().cost;
      const resourceRate = this.getResourceRate(unit);
      const amountNeed = Math.floor(cost / resourceRate);
      const amountHave: number = this.getAvailableUnits(unit);

      while (currentValue < amountHave && currentValue < amountNeed) {
        this.addValue(unit);
        currentValue++;
      }
    },
    // Perhaps this is unnecessary. It's just a >0 check.
    hasUnits(unit: SpendableResource): boolean {
      return this.getAvailableUnits(unit) > 0;
    },
    getAvailableUnits(unit: SpendableResource): number {
      let amount: number | undefined = undefined;
      const model = this.asModel();
      const thisPlayer = model.playerView.thisPlayer;
      switch (unit) {
      case 'heat':
        if (model.hasOwnProperty('available')) {
          amount = model.available?.[unit] ?? -1;
        } else {
          amount = this.availableHeat();
        }
        break;

      case 'steel':
      case 'titanium':
      case 'plants':
        if (model.hasOwnProperty('available')) {
          amount = model.available?.[unit] ?? -1;
          break;
        }
      // eslint-disable-next-line no-fallthrough
      case 'megaCredits':
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
      case 'corruption':
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
      // Soil Enrichment requires discarding one microbe from any card.
      // That the card being paid for by the client shows that there's already a spare microbe around, and
      // that the server has decided there's enough money to play it.
      //
      // The only microbes that can be used for payment are those on Psychopriles.
      // If you don't have Psychopriles but are still paying for Soil Enrichment,
      // then amount, below would be -1, so the Math.max makes sure it's zero.

      // BTW, this could be managed by some derivative of reserveUnits that took extended resources into account.
      if (unit === 'microbes' && this.asModel().card?.name === CardName.SOIL_ENRICHMENT) {
        // Find a card other than Psychopriles with micrboes.
        // If there is none, then Psychopriles can't use every one.
        if (!thisPlayer.tableau.some((card) => {
          return card.name !== CardName.PSYCHROPHILES && getCard(card.name)?.resourceType === CardResource.MICROBE && (card.resources ?? 0) > 0;
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
      if (stormcraft?.resources !== undefined) {
        return thisPlayer.heat + (stormcraft.resources * 2);
      }
      return thisPlayer.heat;
    },
  },
  computed: {
    descriptions(): Record<SpendableResource, string> {
      return {
        steel: 'Steel',
        titanium: 'Titanium',
        heat: 'Heat',
        seeds: 'Seeds',
        auroraiData: 'Data',
        kuiperAsteroids: 'Asteroids',
        spireScience: 'Science',
        megaCredits: 'M€',
        floaters: 'Floaters',
        graphene: 'Graphene',
        lunaArchivesScience: 'Science',
        microbes: 'Microbes',
        plants: 'Plants',
        corruption: 'Corruption',
      };
    },
  },
};
