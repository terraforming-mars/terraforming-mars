<script lang="ts">
import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';

import {GRAPHENE_VALUE, SEED_VALUE} from '@/common/constants';
import {Payment, PAYMENT_KEYS} from '@/common/inputs/Payment';
import Card from '@/client/components/card/Card.vue';
import {getCardOrThrow} from '@/client/cards/ClientCardManifest';
import {CardModel} from '@/common/models/CardModel';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {PaymentWidgetMixin, SelectProjectCardToPlayModel} from '@/client/mixins/PaymentWidgetMixin';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {Tag} from '@/common/cards/Tag';
import {Units} from '@/common/Units';
import {CardName} from '@/common/cards/CardName';
import {SelectProjectCardToPlayResponse} from '@/common/inputs/InputResponse';

export default Vue.extend({
  name: 'SelectProjectCardToPlay',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
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
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
  },
  data(): SelectProjectCardToPlayModel {
    let card: CardModel | undefined;
    let cards: Array<CardModel> = [];
    if (this.playerinput !== undefined &&
            this.playerinput.cards !== undefined &&
            this.playerinput.cards.length > 0) {
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
      heat: 0,
      megaCredits: 0,
      steel: 0,
      titanium: 0,
      microbes: 0,
      science: 0,
      seeds: 0,
      floaters: 0,
      auroraiData: 0,
      graphene: 0,
      warning: undefined,
      available: Units.of({}),
    };
  },
  components: {
    Card,
    AppButton,
  },
  mounted() {
    Vue.nextTick(() => {
      this.card = this.getCard();
      this.cost = this.card.calculatedCost ?? 0;
      this.tags = this.getCardTags(),
      this.reserveUnits = this.card.reserveUnits ?? Units.EMPTY;
      this.megaCredits = (this as unknown as typeof PaymentWidgetMixin.methods).getMegaCreditsMax();

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
      for (const target of PAYMENT_KEYS) {
        if (target === 'megaCredits') {
          continue;
        }
        this[target] = 0;
      }

      let megacreditBalance = Math.max(this.cost - this.thisPlayer.megaCredits, 0);

      // Calcualtes the optimal number of units to use given the unit value.
      //
      // It reads `megacreditBalance` as the remaining balance, and deducts the
      // consumed balance as part of this method.
      //
      // It returns the number of units consumed from availableUnits to make that
      const deductUnits = function(
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

        megacreditBalance -= contributingUnits * unitValue;
        return contributingUnits;
      };

      // This function help save some money at the end
      const saveOverSpendingUnits = function(
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
      };

      if (megacreditBalance > 0 && this.canUseSeeds()) {
        this.seeds = deductUnits(this.playerinput.seeds, SEED_VALUE);
      }

      // TODO(kberg): create constants for these resource types

      if (megacreditBalance > 0 && this.canUseMicrobes()) {
        this.microbes = deductUnits(this.playerinput.microbes, 2);
      }

      if (megacreditBalance > 0 && this.canUseFloaters()) {
        this.floaters = deductUnits(this.playerinput.floaters, 3);
      }

      if (megacreditBalance > 0 && this.canUseScience()) {
        this.science = deductUnits(this.playerinput.science, 1);
      }

      if (megacreditBalance > 0 && this.canUseGraphene()) {
        this.graphene = deductUnits(this.playerinput.graphene, GRAPHENE_VALUE);
      }

      this.available.steel = Math.max(this.thisPlayer.steel - this.reserveUnits.steel, 0);
      if (megacreditBalance > 0 && this.canUseSteel()) {
        this.steel = deductUnits(this.available.steel, this.thisPlayer.steelValue, true);
      }

      this.available.titanium = Math.max(this.thisPlayer.titanium - this.reserveUnits.titanium, 0);
      if (megacreditBalance > 0 && this.canUseTitanium()) {
        this.titanium = deductUnits(this.available.titanium, this.thisPlayer.titaniumValue, true);
      }
      if (megacreditBalance > 0 && this.canUseTitanium() === false && this.canUseLunaTradeFederationTitanium()) {
        this.titanium = deductUnits(this.available.titanium, this.thisPlayer.titaniumValue - 1, true);
      }

      this.available.heat = Math.max(this.availableHeat() - this.reserveUnits.heat, 0);
      if (megacreditBalance > 0 && this.canUseHeat()) {
        this.heat = deductUnits(this.available.heat, 1);
      }

      // If we are overspending
      if (megacreditBalance < 0) {
        // Try to spend less resource if possible, in the reverse order of the payment (also from high to low)
        // We need not try to save heat since heat is paid last at value 1. We will never overspend in heat.
        // We do not need to save Ti either because Ti is paid last before heat. If we overspend, it is because of Ti.
        // We cannot reduce the amount of Ti and still pay enough.
        this.steel -= saveOverSpendingUnits(this.steel, this.thisPlayer.steelValue);
        this.floaters -= saveOverSpendingUnits(this.floaters, 3);
        this.microbes -= saveOverSpendingUnits(this.microbes, 2);
        this.science -= saveOverSpendingUnits(this.science, 1);
        this.seeds -= saveOverSpendingUnits(this.seeds, SEED_VALUE);
        this.graphene -= saveOverSpendingUnits(this.graphene, GRAPHENE_VALUE);
        this.megaCredits -= saveOverSpendingUnits(this.megaCredits, 1);
      }
    },
    canUseHeat(): boolean {
      return this.playerinput.canUseHeat === true && this.availableHeat() > 0;
    },
    canUseSteel() {
      if (this.card !== undefined && this.available.steel > 0) {
        if (this.tags.includes(Tag.BUILDING) || this.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY) {
          return true;
        }
      }
      return false;
    },
    canUseTitanium() {
      if (this.card !== undefined && this.available.titanium > 0) {
        if (this.tags.includes(Tag.SPACE) || this.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY) {
          return true;
        }
      }
      return false;
    },
    canUseLunaTradeFederationTitanium() {
      return this.card !== undefined && this.available.titanium > 0 && this.playerinput.canUseLunaTradeFederationTitanium === true;
    },
    canUseMicrobes() {
      // FYI microbes are limited to the Psychrophiles card, which allows spending microbes for Plant cards.
      if (this.card !== undefined && (this.playerinput.microbes ?? 0) > 0) {
        if (this.tags.includes(Tag.PLANT)) {
          return true;
        }
      }
      return false;
    },
    canUseFloaters() {
      // FYI floaters are limited to the Dirigibles card.
      if (this.card !== undefined && (this.playerinput.floaters ?? 0) > 0) {
        if (this.tags.includes(Tag.VENUS)) {
          return true;
        }
      }
      return false;
    },
    canUseScience() {
      // FYI science resources are limited to the Luna Archive card, which allows spending its
      // science resources for Moon cards.
      if (this.card !== undefined && (this.playerinput.science ?? 0) > 0) {
        if (this.tags.includes(Tag.MOON)) {
          return true;
        }
      }
      return false;
    },
    canUseSeeds() {
      // FYI seeds are limited to the Soylent Seedling Systems corp card, which allows spending its
      // resources for plant cards and the standard greenery project.
      if (this.card !== undefined && (this.playerinput.seeds ?? 0) > 0) {
        if (this.tags.includes(Tag.PLANT)) {
          return true;
        }
        if (this.card.name === CardName.GREENERY_STANDARD_PROJECT) {
          return true;
        }
      }
      return false;
    },
    canUseGraphene() {
      // FYI graphene is limited to the Carbon Nanosystems card, which allows spending its resources
      // for city and space cards.
      if (this.card !== undefined && (this.playerinput.graphene ?? 0) > 0) {
        if (this.tags.includes(Tag.SPACE) || this.tags.includes(Tag.CITY)) {
          return true;
        }
      }
      return false;
    },
    cardChanged() {
      this.card = this.getCard();
      this.cost = this.card.calculatedCost || 0;
      this.tags = this.getCardTags();
      this.reserveUnits = this.card.reserveUnits ?? Units.EMPTY;
      this.megaCredits = (this as unknown as typeof PaymentWidgetMixin.methods).getMegaCreditsMax();

      this.setDefaultValues();
    },
    hasWarning(): boolean {
      return this.warning !== undefined;
    },
    selectedCardHasWarning(): boolean {
      return this.card !== undefined && this.card.warning !== undefined;
    },
    showReserveSteelWarning(): boolean {
      return this.reserveUnits.steel > 0 && this.canUseSteel();
    },
    showReserveTitaniumWarning(): boolean {
      return this.reserveUnits.titanium > 0 && (this.canUseTitanium() || this.canUseLunaTradeFederationTitanium());
    },
    showReserveHeatWarning(): boolean {
      return this.reserveUnits?.heat > 0 && this.canUseHeat();
    },
    saveData() {
      const payment: Payment = {
        heat: this.heat,
        megaCredits: this.megaCredits,
        steel: this.steel,
        titanium: this.titanium,
        microbes: this.microbes,
        floaters: this.floaters,
        science: this.science,
        seeds: this.seeds,
        graphene: this.graphene,
        auroraiData: 0,
      };
      let totalSpent = 0;
      for (const target of PAYMENT_KEYS) {
        if (payment[target] > this.getAmount(target)) {
          this.warning = `You do not have enough ${target}`;
          return;
        }
        totalSpent += payment[target] * this.getResourceRate(target);
      }

      if (totalSpent < this.cost) {
        this.warning = 'Haven\'t spent enough';
        return;
      }

      if (totalSpent > this.cost) {
        const diff = totalSpent - this.cost;
        for (const target of PAYMENT_KEYS) {
          if (payment[target] && diff >= this.getResourceRate(target)) {
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
            payment: payment,
          });
        } else {
          this.warning = 'Please adjust payment amount';
          return;
        }
      } else {
        this.onsave({
          type: 'projectCard',
          card: this.card.name,
          payment: payment,
        });
      }
    },
  },
});
</script>
<template>
<div class="payments_cont">

  <div v-if="showtitle === true">{{ $t(playerinput.title) }}</div>

  <label v-for="availableCard in cards" class="payments_cards" :key="availableCard.name">
    <input class="hidden" type="radio" v-model="cardName" v-on:change="cardChanged()" :value="availableCard.name" />
    <Card class="cardbox" :card="availableCard" />
  </label>

  <section v-trim-whitespace>
    <div v-if="selectedCardHasWarning()" class="card-warning">{{ $t(card.warning) }}</div>

    <h3 class="payments_title" v-i18n>How to pay?</h3>

    <div class="payments_type input-group" v-if="canUseSteel()">
      <i class="resource_icon resource_icon--steel payments_type_icon" title="Pay by Steel"></i>
      <AppButton type="minus" @click="reduceValue('steel', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <AppButton type="plus" @click="addValue('steel', 1, available.steel)" />
      <AppButton type="max" @click="setMaxValue('steel', available.steel)" title="MAX" />
    </div>
    <div v-if="showReserveSteelWarning()" class="card-warning" v-i18n>
    (Some steel is unavailable here in reserve for the project card.)
    </div>

    <div class="payments_type input-group" v-if="canUseTitanium() || canUseLunaTradeFederationTitanium()">
      <i class="resource_icon resource_icon--titanium payments_type_icon" :title="$t('Pay by Titanium')"></i>
      <AppButton type="minus" @click="reduceValue('titanium', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <AppButton type="plus" @click="addValue('titanium', 1, available.titanium)" />
      <AppButton type="max" @click="setMaxValue('titanium', available.titanium)" title="MAX" />
    </div>
    <div v-if="showReserveTitaniumWarning()" class="card-warning" v-i18n>
    (Some titanium is unavailable here in reserve for the project card.)
    </div>

    <div class="payments_type input-group" v-if="canUseHeat()">
      <i class="resource_icon resource_icon--heat payments_type_icon" :title="$t('Pay by Heat')"></i>
      <AppButton type="minus" @click="reduceValue('heat', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <AppButton type="plus" @click="addValue('heat', 1, available.heat)" />
      <AppButton type="max" @click="setMaxValue('heat', available.heat)" title="MAX" />
    </div>
    <div v-if="showReserveHeatWarning()" class="card-warning" v-i18n>
    (Some heat is unavailable here in reserve for the project card.)
    </div>

    <div class="payments_type input-group" v-if="canUseMicrobes()">
      <i class="resource_icon resource_icon--microbe payments_type_icon" :title="$t('Pay by Microbes')"></i>
      <AppButton type="minus" @click="reduceValue('microbes', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="microbes" />
      <AppButton type="plus" @click="addValue('microbes', 1)" />
      <AppButton type="max" @click="setMaxValue('microbes')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseFloaters()">
      <i class="resource_icon resource_icon--floater payments_type_icon" :title="$t('Pay by Floaters')"></i>
      <AppButton type="minus" @click="reduceValue('floaters', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="floaters" />
      <AppButton type="plus" @click="addValue('floaters', 1)" />
      <AppButton type="max" @click="setMaxValue('floaters')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseScience()">
      <i class="resource_icon resource_icon--science payments_type_icon" :title="$t('Pay by Science Resources')"></i>
      <AppButton type="minus" @click="reduceValue('science', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="science" />
      <AppButton type="plus" @click="addValue('science', 1)" />
      <AppButton type="max" @click="setMaxValue('science')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseSeeds()">
      <i class="resource_icon resource_icon--seed payments_type_icon" :title="$t('Pay by Seeds')"></i>
      <AppButton type="minus" @click="reduceValue('seeds', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="seeds" />
      <AppButton type="plus" @click="addValue('seeds', 1)" />
      <AppButton type="max" @click="setMaxValue('seeds')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseGraphene()">
      <i class="resource_icon resource_icon--graphene payments_type_icon" :title="$t('Pay with graphene')"></i>
      <AppButton type="minus" @click="reduceValue('graphene', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="graphene" />
      <AppButton type="plus" @click="addValue('graphene', 1)" />
      <AppButton type="max" @click="setMaxValue('graphene')" title="MAX" />
    </div>


    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" :title="$t('Pay by Megacredits')"></i>
      <AppButton type="minus" @click="reduceValue('megaCredits', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="megaCredits" />
      <AppButton type="plus" @click="addValue('megaCredits', 1)" />
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <AppButton size="big" @click="saveData" :title="playerinput.buttonLabel" data-test="save"/>
    </div>
  </section>
</div>
</template>
