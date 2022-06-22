<script lang="ts">
import Vue from 'vue';
import Button from '@/client/components/common/Button.vue';

import {HowToPay} from '@/common/inputs/HowToPay';
import Card from '@/client/components/card/Card.vue';
import {getCardOrThrow} from '@/client/cards/ClientCardManifest';
import {CardModel} from '@/common/models/CardModel';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {PaymentWidgetMixin, SelectHowToPayForProjectCardModel, unit} from '@/client/mixins/PaymentWidgetMixin';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {Tags} from '@/common/cards/Tags';
import {Units} from '@/common/Units';
import {CardName} from '@/common/cards/CardName';
import {InputResponse} from '@/common/inputs/InputResponse';

export default Vue.extend({
  name: 'SelectHowToPayForProjectCard',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: InputResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  computed: {
    thisPlayer: function(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
  },
  data(): SelectHowToPayForProjectCardModel {
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
      data: 0,
      floaters: 0,
      warning: undefined,
      available: Units.of({}),
    };
  },
  components: {
    Card,
    Button,
  },
  mounted() {
    Vue.nextTick(() => {
      this.$data.card = this.getCard();
      this.$data.cost = this.$data.card.calculatedCost;
      this.$data.tags = this.getCardTags(),
      this.$data.megaCredits = (this as unknown as typeof PaymentWidgetMixin.methods).getMegaCreditsMax();

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
      this.microbes = 0;
      this.floaters = 0;
      this.science = 0;
      this.seeds = 0;
      this.steel = 0;
      this.titanium = 0;
      this.heat = 0;

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
        this.seeds = deductUnits(this.playerinput.seeds, 5);
      }

      if (megacreditBalance > 0 && this.canUseMicrobes()) {
        this.microbes = deductUnits(this.playerinput.microbes, 2);
      }

      if (megacreditBalance > 0 && this.canUseFloaters()) {
        this.floaters = deductUnits(this.playerinput.floaters, 3);
      }

      if (megacreditBalance > 0 && this.canUseScience()) {
        this.science = deductUnits(this.playerinput.science, 1);
      }

      this.available.steel = Math.max(this.thisPlayer.steel - this.card.reserveUnits.steel, 0);
      if (megacreditBalance > 0 && this.canUseSteel()) {
        this.steel = deductUnits(this.available.steel, this.thisPlayer.steelValue, true);
      }

      this.available.titanium = Math.max(this.thisPlayer.titanium - this.card.reserveUnits.titanium, 0);
      if (megacreditBalance > 0 && this.canUseTitanium()) {
        this.titanium = deductUnits(this.available.titanium, this.thisPlayer.titaniumValue, true);
      }

      this.available.heat = Math.max(this.thisPlayer.heat - this.card.reserveUnits.heat, 0);
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
        this.seeds -= saveOverSpendingUnits(this.seeds, 5);
        this.megaCredits -= saveOverSpendingUnits(this.megaCredits, 1);
      }
    },
    canUseHeat(): boolean {
      return this.playerinput.canUseHeat === true && this.thisPlayer.heat > 0;
    },
    canUseSteel() {
      if (this.card !== undefined && this.available.steel > 0) {
        if (this.tags.includes(Tags.BUILDING) || this.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY) {
          return true;
        }
      }
      return false;
    },
    canUseTitanium() {
      if (this.card !== undefined && this.available.titanium > 0) {
        if (this.tags.includes(Tags.SPACE) || this.thisPlayer.lastCardPlayed === CardName.LAST_RESORT_INGENUITY) {
          return true;
        }
      }
      return false;
    },
    canUseMicrobes() {
      // FYI Microbes are limited to the Psychrophiles card, which allows spending microbes for Plant cards.
      if (this.card !== undefined && (this.playerinput.microbes ?? 0) > 0) {
        if (this.tags.includes(Tags.PLANT)) {
          return true;
        }
      }
      return false;
    },
    canUseFloaters() {
      // FYI Floaters are limited to the DIRIGIBLES card.
      if (this.card !== undefined && (this.playerinput.floaters ?? 0) > 0) {
        if (this.tags.includes(Tags.VENUS)) {
          return true;
        }
      }
      return false;
    },
    canUseScience() {
      // FYI Science Resources are limited to the Luna Archive card, which allows spending its science resources for Moon cards.
      if (this.card !== undefined && (this.playerinput.science ?? 0) > 0) {
        if (this.tags.includes(Tags.MOON)) {
          return true;
        }
      }
      return false;
    },
    canUseSeeds() {
      // FYI Seed Resources are limited to the Soylent Seedling Systems corp card, which allows spending its
      // resources for plant cards and the standard greenery project.
      if (this.card !== undefined && (this.playerinput.seeds ?? 0) > 0) {
        if (this.tags.includes(Tags.PLANT)) {
          return true;
        }
        if (this.card.name === CardName.GREENERY_STANDARD_PROJECT) {
          return true;
        }
      }
      return false;
    },
    cardChanged() {
      this.card = this.getCard();
      this.cost = this.card.calculatedCost || 0;
      this.tags = this.getCardTags();

      this.megaCredits = (this as unknown as typeof PaymentWidgetMixin.methods).getMegaCreditsMax();

      this.setDefaultValues();
    },
    hasWarning(): boolean {
      return this.warning !== undefined;
    },
    hasCardWarning(): boolean {
      return this.card !== undefined && this.card.warning !== undefined;
    },
    showReserveSteelWarning(): boolean {
      return this.card?.reserveUnits?.steel > 0 && this.canUseSteel();
    },
    showReserveTitaniumWarning(): boolean {
      return this.card?.reserveUnits?.titanium > 0 && this.canUseTitanium();
    },
    showReserveHeatWarning(): boolean {
      return this.card?.reserveUnits?.heat > 0 && this.canUseHeat();
    },
    saveData() {
      const htp: HowToPay = {
        heat: this.heat,
        megaCredits: this.megaCredits,
        steel: this.steel,
        titanium: this.titanium,
        microbes: this.microbes,
        floaters: this.floaters,
        science: this.science,
        seeds: this.seeds,
        data: 0,
      };
      let totalSpent = 0;
      for (const target of unit) {
        if (htp[target] > this.getAmount(target)) {
          this.$data.warning = `You do not have enough ${target}`;
          return;
        }
        totalSpent += htp[target] * this.getResourceRate(target);
      }

      if (totalSpent < this.cost) {
        this.warning = 'Haven\'t spent enough';
        return;
      }

      if (totalSpent > this.cost) {
        const diff = totalSpent - this.cost;
        for (const target of unit) {
          if (htp[target] && diff >= this.getResourceRate(target)) {
            this.$data.warning = `You cannot overspend ${target}`;
            return;
          }
        }
      }

      const showAlert = getPreferences().show_alerts;

      if (totalSpent > this.cost && showAlert) {
        const diff = totalSpent - this.cost;

        if (confirm('Warning: You are overpaying by ' + diff + ' M€')) {
          this.onsave([[
            this.card.name,
            JSON.stringify(htp),
          ]]);
        } else {
          this.warning = 'Please adjust payment amount';
          return;
        }
      } else {
        this.onsave([[
          this.card.name,
          JSON.stringify(htp),
        ]]);
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
    <div v-if="hasCardWarning()" class="card-warning">{{ $t(card.warning) }}</div>

    <h3 class="payments_title" v-i18n>How to pay?</h3>

    <div class="payments_type input-group" v-if="canUseSteel()">
      <i class="resource_icon resource_icon--steel payments_type_icon" title="Pay by Steel"></i>
      <Button type="minus" @click="reduceValue('steel', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <Button type="plus" @click="addValue('steel', 1, available.steel)" />
      <Button type="max" @click="setMaxValue('steel', available.steel)" title="MAX" />
    </div>
    <div v-if="showReserveSteelWarning()" class="card-warning" v-i18n>
    (Some steel is unavailable here in reserve for the project card.)
    </div>

    <div class="payments_type input-group" v-if="canUseTitanium()">
      <i class="resource_icon resource_icon--titanium payments_type_icon" :title="$t('Pay by Titanium')"></i>
      <Button type="minus" @click="reduceValue('titanium', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <Button type="plus" @click="addValue('titanium', 1, available.titanium)" />
      <Button type="max" @click="setMaxValue('titanium', available.titanium)" title="MAX" />
    </div>
    <div v-if="showReserveTitaniumWarning()" class="card-warning" v-i18n>
    (Some titanium is unavailable here in reserve for the project card.)
    </div>

    <div class="payments_type input-group" v-if="canUseHeat()">
      <i class="resource_icon resource_icon--heat payments_type_icon" :title="$t('Pay by Heat')"></i>
      <Button type="minus" @click="reduceValue('heat', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <Button type="plus" @click="addValue('heat', 1, available.heat)" />
      <Button type="max" @click="setMaxValue('heat', available.heat)" title="MAX" />
    </div>
    <div v-if="showReserveHeatWarning()" class="card-warning" v-i18n>
    (Some heat is unavailable here in reserve for the project card.)
    </div>

    <div class="payments_type input-group" v-if="canUseMicrobes()">
      <i class="resource_icon resource_icon--microbe payments_type_icon" :title="$t('Pay by Microbes')"></i>
      <Button type="minus" @click="reduceValue('microbes', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="microbes" />
      <Button type="plus" @click="addValue('microbes', 1)" />
      <Button type="max" @click="setMaxValue('microbes')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseFloaters()">
      <i class="resource_icon resource_icon--floater payments_type_icon" :title="$t('Pay by Floaters')"></i>
      <Button type="minus" @click="reduceValue('floaters', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="floaters" />
      <Button type="plus" @click="addValue('floaters', 1)" />
      <Button type="max" @click="setMaxValue('floaters')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseScience()">
      <i class="resource_icon resource_icon--science payments_type_icon" :title="$t('Pay by Science Resources')"></i>
      <Button type="minus" @click="reduceValue('science', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="science" />
      <Button type="plus" @click="addValue('science', 1)" />
      <Button type="max" @click="setMaxValue('science')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseSeeds()">
      <i class="resource_icon resource_icon--seed payments_type_icon" :title="$t('Pay by Seeds')"></i>
      <Button type="minus" @click="reduceValue('seeds', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="seeds" />
      <Button type="plus" @click="addValue('seeds', 1)" />
      <Button type="max" @click="setMaxValue('seeds')" title="MAX" />
    </div>

    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" :title="$t('Pay by Megacredits')"></i>
      <Button type="minus" @click="reduceValue('megaCredits', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="megaCredits" />
      <Button type="plus" @click="addValue('megaCredits', 1)" />
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <Button size="big" @click="saveData" :title="playerinput.buttonLabel" data-test="save"/>
    </div>
  </section>
</div>
</template>
