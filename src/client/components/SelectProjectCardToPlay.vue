<template>
<div class="payments_cont">

  <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>

  <label v-for="availableCard in cards" class="payments_cards" :key="availableCard.name">
    <input class="hidden" type="radio" v-model="cardName" v-on:change="cardChanged()" :value="availableCard.name" />
    <Card class="cardbox" :card="availableCard" />
  </label>

  <section v-trim-whitespace>
    <div v-if="selectedCardHasWarning()" class="card-warning">{{ $t(card.warning) }}</div>
    <warnings-component :warnings="card.warnings"></warnings-component>

    <h3 class="payments_title" v-i18n>How to pay?</h3>

    <template v-for="unit of SPENDABLE_RESOURCES">
      <div v-bind:key="unit">
        <payment-unit-component
          v-model.number="payment[unit]"
          v-if="canUse(unit) === true"
          :unit="unit"
          :description="descriptions[unit]"
          @plus="addValue(unit)"
          @minus="reduceValue(unit)"
          @max="setMaxValue(unit)">
        </payment-unit-component>
        <div v-if="showReserveWarning(unit)" class="card-warning" v-i18n="$t(unit)">
        (Some ${0} are unavailable here in reserve for the project card.)
        </div>
      </div>
    </template>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <AppButton size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" data-test="save"/>
    </div>
  </section>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import AppButton from '@/client/components/common/AppButton.vue';
import {Payment} from '@/common/inputs/Payment';
import {SpendableResource, SPENDABLE_RESOURCES} from '@/common/inputs/Spendable';
import Card from '@/client/components/card/Card.vue';
import {getCardOrThrow} from '@/client/cards/ClientCardManifest';
import PaymentUnitComponent from '@/client/components/PaymentUnit.vue';
import {CardModel} from '@/common/models/CardModel';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {PaymentWidgetMixin, SelectProjectCardToPlayDataModel} from '@/client/mixins/PaymentWidgetMixin';
import {SelectProjectCardToPlayModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {Tag} from '@/common/cards/Tag';
import {Units} from '@/common/Units';
import {CardName} from '@/common/cards/CardName';
import {SelectProjectCardToPlayResponse} from '@/common/inputs/InputResponse';
import WarningsComponent from '@/client/components/WarningsComponent.vue';

export default Vue.extend({
  name: 'SelectProjectCardToPlay',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => SelectProjectCardToPlayModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectProjectCardToPlayResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  computed: {
    ...PaymentWidgetMixin.computed,
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    SPENDABLE_RESOURCES(): ReadonlyArray<keyof Payment> {
      return [
        'steel',
        'titanium',
        'heat',
        'plants',
        'microbes',
        'floaters',
        'lunaArchivesScience',
        'seeds',
        'graphene',
        'megaCredits',
        'corruption',
      ];
    },
  },
  data(): SelectProjectCardToPlayDataModel {
    let card: CardModel | undefined;
    let cards: ReadonlyArray<CardModel> = [];
    if ((this.playerinput?.cards?.length ?? 0) > 0) {
      cards = CardOrderStorage.getOrdered(
        CardOrderStorage.getCardOrder(this.playerView.id),
        this.playerinput.cards,
      );
      card = cards[0];
    }
    if (card === undefined) {
      throw new Error('no card provided in player input');
    }
    return {
      cardName: card.name,
      card: card,
      reserveUnits: card.reserveUnits ?? Units.EMPTY,
      cards: cards,
      cost: 0,
      tags: [],
      payment: {...Payment.EMPTY},
      warning: undefined,
      available: Units.of({}),
    };
  },
  components: {
    Card,
    AppButton,
    PaymentUnitComponent,
    WarningsComponent,
  },
  mounted() {
    Vue.nextTick(() => {
      this.card = this.getCard();
      this.cost = this.card.calculatedCost ?? 0;
      this.tags = this.getCardTags(),
      this.reserveUnits = this.card.reserveUnits ?? Units.EMPTY;

      this.setDefaultValues();
    });
  },
  methods: {
    ...PaymentWidgetMixin.methods,
    getCard() {
      const card = this.cards.find((c) => c.name === this.cardName); // this.player.cardsInHand.concat(this.player.selfReplicatingRobotsCards).find((c) => c.name === this.cardName);
      if (card === undefined) {
        throw new Error(`card not found ${this.cardName}`);
      }
      return card;
    },
    getCardTags() {
      return getCardOrThrow(this.cardName).tags;
    },
    setDefaultValues() {
      // Calculates the optimal number of units to use given the unit value.
      //
      // It reads `megacreditBalance` as the remaining balance, and deducts the
      // consumed balance as part of this method.
      //
      // It returns the number of units consumed from availableUnits to make that
      function deductUnits(
        availableUnits: number | undefined,
        unitValue: number,
        overpay: boolean = true): number {
        if (availableUnits === undefined || availableUnits === 0) {
          return 0;
        }
        // The number of units required to sell to meet the balance.
        const _tmp = megacreditBalance / unitValue;
        const balanceAsUnits = overpay ? Math.ceil(_tmp) : Math.floor(_tmp);
        const contributingUnits = Math.min(availableUnits, balanceAsUnits);

        // console.log(megacreditBalance, unitValue, availableUnits, overpay, '-', _tmp, balanceAsUnits, contributingUnits);

        megacreditBalance -= contributingUnits * unitValue;
        return contributingUnits;
      }

      // This function help save some money at the end
      function saveOverspendingUnits(
        spendingUnits: number | undefined,
        unitValue: number): number {
        if (spendingUnits === undefined || spendingUnits === 0 || megacreditBalance === 0) {
          return 0;
        }
        // Calculate the unit of resource we can save and still pay enough
        const overSpendingAsUnits = Math.floor(Math.abs(megacreditBalance) / unitValue);
        const toSaveUnits = Math.min(spendingUnits, overSpendingAsUnits);

        megacreditBalance += toSaveUnits * unitValue;
        return toSaveUnits;
      }

      for (const target of SPENDABLE_RESOURCES) {
        this.payment[target] = 0;
      }
      // This is defined down here, but is used in the functions above.
      let megacreditBalance = this.cost;

      // Prioritize special resource types that are only ever used for buying cards.
      // Of course this runs the risk of a player not having special resources for some award,
      // milestone, or requirement.
      for (const unit of ['seeds', 'lunaArchivesScience', 'graphene'] as const) {
        if (megacreditBalance > 0 && this.canUse(unit)) {
          this.payment[unit] = deductUnits(this.getAvailableUnits(unit), this.getResourceRate(unit), false);
        }
      }

      // Set MC payment after knowning how much of other resources are consumed
      this.payment.megaCredits = Math.max(0, Math.min(this.thisPlayer.megaCredits, megacreditBalance));

      // console.log('units: ' + JSON.stringify(this.payment, null, 2));
      // console.log('balance', megacreditBalance);

      // Use as much MC as possible.
      megacreditBalance = Math.max(megacreditBalance - this.thisPlayer.megaCredits, 0);

      // console.log('balance', megacreditBalance);

      for (const unit of ['microbes', 'floaters', 'corruption'] as const) {
        if (megacreditBalance > 0 && this.canUse(unit)) {
          this.payment[unit] = deductUnits(this.getAvailableUnits(unit), this.getResourceRate(unit));
        }
      }

      // These aren't in the loop above because of the reserve units bit.
      // It's doable of course.
      this.available.steel = Math.max(this.thisPlayer.steel - this.reserveUnits.steel, 0);
      if (megacreditBalance > 0 && this.canUse('steel')) {
        this.payment.steel = deductUnits(this.available.steel, this.getResourceRate('steel'), true);
      }

      this.available.titanium = Math.max(this.thisPlayer.titanium - this.reserveUnits.titanium, 0);
      if (megacreditBalance > 0 && (this.canUse('titanium') || this.canUseLunaTradeFederationTitanium())) {
        this.payment.titanium = deductUnits(this.available.titanium, this.getResourceRate('titanium'), true);
      }

      this.available.heat = Math.max(this.availableHeat() - this.reserveUnits.heat, 0);
      if (megacreditBalance > 0 && this.canUse('heat')) {
        this.payment.heat = deductUnits(this.available.heat, this.getResourceRate('heat'));
      }

      this.available.plants = Math.max(this.thisPlayer.plants - this.reserveUnits.plants, 0);
      if (megacreditBalance > 0 && this.canUse('plants')) {
        this.payment.plants = deductUnits(this.available.plants, this.getResourceRate('plants'));
      }

      // If we are overspending
      if (megacreditBalance < 0) {
        // Try to spend less resource if possible, in the reverse order of the payment (also from high to low)
        // We need not try to save heat since heat is paid last at value 1. We will never overspend in heat.
        // We do not need to save Ti either because Ti is paid last before heat. If we overspend, it is because of Ti.
        // We cannot reduce the amount of Ti and still pay enough.
        for (const key of [
          'steel',
          'plants',
          'floaters',
          'microbes',
          'seeds',
          'graphene',
          'lunaArchivesScience',
          'corruption',
          'megaCredits'] as const) {
          this.payment[key] -= saveOverspendingUnits(this.payment[key], this.getResourceRate(key));
        }
      }
      // See top that sets megacreditBalance
      // this.payment['megaCredits'] = megacreditBalance;
    },
    canUseTitaniumRegularly(): boolean {
      return this.tags.includes(Tag.SPACE) ||
          this.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY;
    },
    cardCanUse(unit: SpendableResource): boolean {
      switch (unit) {
      case 'megaCredits':
        return true;
      case 'heat':
        return this.playerinput.paymentOptions.heat === true;
      case 'steel':
        return this.tags.includes(Tag.BUILDING) ||
          this.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY;
      case 'titanium':
        return this.canUseTitaniumRegularly() ||
          this.playerinput.paymentOptions.lunaTradeFederationTitanium === true;
      case 'plants':
        return this.tags.includes(Tag.BUILDING) && this.playerinput.paymentOptions.plants === true;
      case 'microbes':
        return this.tags.includes(Tag.PLANT);
      case 'floaters':
        return this.tags.includes(Tag.VENUS);
      case 'lunaArchivesScience':
        return this.tags.includes(Tag.MOON);
      case 'seeds':
        return this.tags.includes(Tag.PLANT) ||
            this.card.name === CardName.GREENERY_STANDARD_PROJECT;
      case 'graphene':
        return this.tags.includes(Tag.SPACE) ||
            this.tags.includes(Tag.CITY);
      case 'corruption':
        return this.tags.includes(Tag.EARTH) && this.playerinput.paymentOptions.corruption === true;
      default:
        throw new Error('Unknown unit ' + unit);
      }
    },
    canUse(unit: SpendableResource) {
      if (!this.hasUnits(unit)) {
        return false;
      }
      if (this.card === undefined) {
        return false;
      }
      return this.cardCanUse(unit);
    },
    canUseLunaTradeFederationTitanium(): boolean {
      return this.playerinput.paymentOptions.lunaTradeFederationTitanium === true;
    },
    cardChanged() {
      this.card = this.getCard();
      this.cost = this.card.calculatedCost || 0;
      this.tags = this.getCardTags();
      this.reserveUnits = this.card.reserveUnits ?? Units.EMPTY;

      this.setDefaultValues();
    },
    getTitaniumResourceRate(): number {
      const titaniumValue = this.asModel().playerView.thisPlayer.titaniumValue;
      if (this.canUseTitaniumRegularly()) {
        return titaniumValue;
      }
      return titaniumValue - 1;
    },
    hasWarning(): boolean {
      return this.warning !== undefined;
    },
    selectedCardHasWarning(): boolean {
      return this.card !== undefined && this.card.warning !== undefined;
    },
    showReserveWarning(unit: SpendableResource): boolean {
      switch (unit) {
      case 'titanium':
        return this.reserveUnits.titanium > 0 && (this.canUse('titanium') || this.canUseLunaTradeFederationTitanium());
      case 'steel':
      case 'heat':
      case 'plants':
        return this.reserveUnits[unit] > 0 && this.canUse(unit);
      }
      return false;
    },
    saveData() {
      let totalSpent = 0;

      for (const target of SPENDABLE_RESOURCES) {
        totalSpent += this.payment[target] * this.getResourceRate(target);
      }

      for (const target of SPENDABLE_RESOURCES) {
        if (this.payment[target] > this.getAvailableUnits(target)) {
          this.warning = `You do not have enough ${target}`;
          return;
        }
      }
      if (totalSpent < this.cost) {
        this.warning = 'Haven\'t spent enough';
        return;
      }

      if (totalSpent > this.cost) {
        const diff = totalSpent - this.cost;
        for (const target of SPENDABLE_RESOURCES) {
          if (this.payment[target] && diff >= this.getResourceRate(target)) {
            this.warning = `You cannot overspend ${target}`;
            return;
          }
        }
      }

      const showAlert = getPreferences().show_alerts;

      if (totalSpent > this.cost && showAlert) {
        const diff = totalSpent - this.cost;

        if (confirm('Warning: You are overpaying by ' + diff + ' M€')) {
          this.onsave({
            type: 'projectCard',
            card: this.card.name,
            payment: this.payment,
          });
        } else {
          this.warning = 'Please adjust payment amount';
          return;
        }
      } else {
        this.onsave({
          type: 'projectCard',
          card: this.card.name,
          payment: this.payment,
        });
      }
    },
  },
});
</script>
