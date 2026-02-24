// Common logic for SelectPayment and SelectProjectCardToPlay
import {computed} from 'vue';
import {CardName} from '@/common/cards/CardName';
import {CardResource} from '@/common/CardResource';
import {getCard} from '@/client/cards/ClientCardManifest';
import {DEFAULT_PAYMENT_VALUES, Payment} from '@/common/inputs/Payment';
import {SPENDABLE_RESOURCES, SpendableResource} from '@/common/inputs/Spendable';
import {SelectPaymentModel, SelectProjectCardToPlayModel} from '@/common/models/PlayerInputModel';
import {CardModel} from '@/common/models/CardModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';

export type PaymentWidgetModel = {
  payment: Payment;
  cost: number;
  playerView: PlayerViewModel;
  playerinput: SelectPaymentModel | SelectProjectCardToPlayModel;
  card?: CardModel;
  available?: Omit<import('@/common/Units').Units, 'megacredits' | 'energy'>;
};

export function usePaymentWidget(
  getModel: () => PaymentWidgetModel,
  overrides?: {
    getTitaniumResourceRate?: () => number;
  },
) {
  function availableHeat(): number {
    const model = getModel();
    const thisPlayer = model.playerView.thisPlayer;
    const stormcraft = thisPlayer.tableau.find((card) => card.name === CardName.STORMCRAFT_INCORPORATED);
    if (stormcraft?.resources !== undefined) {
      return thisPlayer.heat + (stormcraft.resources * 2);
    }
    return thisPlayer.heat;
  }

  function getTitaniumResourceRate(): number {
    if (overrides?.getTitaniumResourceRate) {
      return overrides.getTitaniumResourceRate();
    }
    const model = getModel();
    const paymentOptions = model.playerinput.paymentOptions;
    const titaniumValue = model.playerView.thisPlayer.titaniumValue;
    if (paymentOptions?.titanium !== true &&
      paymentOptions?.lunaTradeFederationTitanium === true) {
      return titaniumValue - 1;
    }
    return titaniumValue;
  }

  function getResourceRate(unit: SpendableResource): number {
    switch (unit) {
    case 'steel':
      return getModel().playerView.thisPlayer.steelValue;
    case 'titanium':
      return getTitaniumResourceRate();
    default:
      return DEFAULT_PAYMENT_VALUES[unit];
    }
  }

  function getAvailableUnits(unit: SpendableResource): number {
    let amount: number | undefined = undefined;
    const model = getModel();
    const thisPlayer = model.playerView.thisPlayer;
    switch (unit) {
    case 'heat':
      if (model.available !== undefined) {
        amount = model.available[unit] ?? -1;
      } else {
        amount = availableHeat();
      }
      break;

    case 'steel':
    case 'titanium':
    case 'plants':
      if (model.available !== undefined) {
        amount = model.available[unit] ?? -1;
        break;
      }
    // eslint-disable-next-line no-fallthrough
    case 'megaCredits':
      amount = thisPlayer[unit];
      break;

    default: {
      const input = model.playerinput;
      if (input.type === 'payment') {
        switch (unit) {
        case 'spireScience':
        case 'seeds':
        case 'auroraiData':
        case 'kuiperAsteroids':
          amount = input[unit];
        }
      } else {
        switch (unit) {
        case 'floaters':
        case 'microbes':
        case 'lunaArchivesScience':
        case 'seeds':
        case 'graphene':
        case 'kuiperAsteroids':
          amount = input[unit];
        }
      }
    }
    }

    if (amount === undefined) {
      return 0;
    }

    if (unit === 'floaters' && model.card?.name === CardName.STRATOSPHERIC_BIRDS) {
      if (!thisPlayer.tableau.some((card) => {
        return card.name !== CardName.DIRIGIBLES && getCard(card.name)?.resourceType === CardResource.FLOATER && (card.resources ?? 0) > 0;
      })) {
        amount = Math.max(amount - 1, 0);
      }
    }
    if (unit === 'microbes' && model.card?.name === CardName.SOIL_ENRICHMENT) {
      if (!thisPlayer.tableau.some((card) => {
        return card.name !== CardName.PSYCHROPHILES && getCard(card.name)?.resourceType === CardResource.MICROBE && (card.resources ?? 0) > 0;
      })) {
        amount = Math.max(amount - 1, 0);
      }
    }
    return amount;
  }

  function getMegaCreditsMax(): number {
    return Math.min(getAvailableUnits('megaCredits'), getModel().cost);
  }

  function reduceValue(unit: SpendableResource): void {
    const model = getModel();
    const currentValue: number | undefined = model.payment[unit];
    if (currentValue === undefined) {
      throw new Error(`can not reduceValue for ${unit} on this`);
    }

    const adjustedDelta = Math.min(1, currentValue);
    if (adjustedDelta === 0) return;
    model.payment[unit] -= adjustedDelta;
    if (unit !== 'megaCredits') setRemainingMCValue();
  }

  function addValue(unit: SpendableResource): void {
    const model = getModel();
    const currentValue: number | undefined = model.payment[unit];
    if (currentValue === undefined) {
      throw new Error(`can not addValue for ${unit} on this`);
    }

    const maxValue =
      unit === 'megaCredits' ?
        getMegaCreditsMax() :
        getAvailableUnits(unit);

    if (currentValue === maxValue) {
      return;
    }

    const delta = Math.min(1, maxValue - currentValue);
    if (delta === 0) {
      return;
    }
    model.payment[unit] += delta;
    if (unit !== 'megaCredits') {
      setRemainingMCValue();
    }
  }

  function setRemainingMCValue(): void {
    const model = getModel();
    let remainingMC = model.cost;

    for (const resource of SPENDABLE_RESOURCES) {
      if (resource === 'megaCredits') {
        continue;
      }
      const value = (model.payment[resource] ?? 0) * getResourceRate(resource);
      remainingMC -= value;
    }
    model.payment.megaCredits = Math.max(0, Math.min(getMegaCreditsMax(), remainingMC));
  }

  function setMaxValue(unit: SpendableResource): void {
    const model = getModel();
    let currentValue: number | undefined = model.payment[unit];
    if (currentValue === undefined) {
      throw new Error(`can not setMaxValue for ${unit} on this`);
    }
    const cost: number = model.cost;
    const resourceRate = getResourceRate(unit);
    const amountNeed = Math.floor(cost / resourceRate);
    const amountHave: number = getAvailableUnits(unit);

    while (currentValue < amountHave && currentValue < amountNeed) {
      addValue(unit);
      currentValue++;
    }
  }

  function hasUnits(unit: SpendableResource): boolean {
    return getAvailableUnits(unit) > 0;
  }

  const descriptions = computed<Record<SpendableResource, string>>(() => ({
    steel: 'Steel',
    titanium: 'Titanium',
    heat: 'Heat',
    seeds: 'Seeds',
    auroraiData: 'Data',
    kuiperAsteroids: 'Asteroids',
    spireScience: 'Science',
    megaCredits: 'M\u20ac',
    floaters: 'Floaters',
    graphene: 'Graphene',
    lunaArchivesScience: 'Science',
    microbes: 'Microbes',
    plants: 'Plants',
  }));

  return {
    availableHeat,
    getMegaCreditsMax,
    getResourceRate,
    getTitaniumResourceRate,
    reduceValue,
    addValue,
    setRemainingMCValue,
    setMaxValue,
    hasUnits,
    getAvailableUnits,
    descriptions,
  };
}
