<script lang="ts">
import Vue from 'vue';
import {Payment, PaymentUnit, PAYMENT_UNITS} from '@/common/inputs/Payment';
import {PaymentWidgetMixin, SelectPaymentDataModel} from '@/client/mixins/PaymentWidgetMixin';
import {SelectPaymentModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectPaymentResponse} from '@/common/inputs/InputResponse';

export default Vue.extend({
  name: 'SelectPayment',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => SelectPaymentModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectPaymentResponse) => void,
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
  components: {
    AppButton,
  },
  data(): SelectPaymentDataModel {
    return {
      cost: 0,
      payment: {...Payment.EMPTY},
      warning: undefined,
    };
  },
  mounted() {
    Vue.nextTick(() => {
      this.setInitialCost();
      this.payment.megaCredits = this.getMegaCreditsMax();
      this.setDefaultValues();
    });
  },
  methods: {
    ...PaymentWidgetMixin.methods,
    hasWarning() {
      return this.warning !== undefined;
    },
    setInitialCost() {
      this.cost = this.playerinput.amount ?? 0;
    },
    setDefaultValue(
      mcAlreadyCovered: number, // MC values of prior-computed resources.
      unit: PaymentUnit): number {
      if (!this.canUse(unit)) {
        return 0;
      }
      const availableUnits = this.getAvailableUnits(unit);
      if (availableUnits === 0) {
        return 0;
      }

      const cost = this.cost;
      const targetResourceRate = this.getResourceRate(unit);

      // Compute the required minimum quantity needed to contribute.
      let contributingUnits = Math.ceil(Math.max(cost - this.getAvailableUnits('megaCredits') - mcAlreadyCovered, 0) / targetResourceRate);
      contributingUnits = Math.min(contributingUnits, availableUnits);
      let contributingMCValue = contributingUnits * targetResourceRate;

      // When greedy, use as much as possible without overspending. When selfish, use as little as possible
      const greedy = unit !== 'heat';
      if (greedy === true) {
        while (contributingUnits < availableUnits && contributingMCValue <= cost - targetResourceRate) {
          contributingUnits++;
          contributingMCValue += targetResourceRate;
        }
      }

      this.payment[unit] = contributingUnits;
      return contributingMCValue;
    },
    setDefaultValues(reserveMegacredits: boolean = false) {
      const cost = this.cost;

      const megaCredits = this.getAvailableUnits('megaCredits');

      let amountCovered = reserveMegacredits ? megaCredits : 0;
      for (const unit of ['seeds', 'auroraiData', 'steel', 'titanium', 'heat', 'spireScience'] as const) {
        amountCovered += this.setDefaultValue(amountCovered, unit);
      }
      if (!reserveMegacredits) {
        this.payment.megaCredits = Math.min(megaCredits, Math.max(cost - amountCovered, 0));
      }
    },
    setMaxMCValue() {
      this.setMaxValue('megaCredits');
      this.setDefaultValues(/* reserveMegacredits */ true);
    },
    canAffordWithMcOnly() {
      return this.thisPlayer.megaCredits >= this.cost;
    },
    canUse(unit: PaymentUnit): boolean {
      if (unit === 'megaCredits') {
        return true;
      }
      if (unit === 'titanium') {
        if (this.thisPlayer.titanium === 0) {
          return false;
        }
        return this.playerinput.paymentOptions.titanium === true|| this.playerinput.paymentOptions.lunaTradeFederationTitanium === true;
      }
      return this.playerinput.paymentOptions[unit] === true && this.hasUnits(unit);
    },
    saveData() {
      let totalSpent = 0;
      for (const target of PAYMENT_UNITS) {
        totalSpent += this.payment[target] * this.getResourceRate(target);
      }

      for (const target of PAYMENT_UNITS) {
        if (this.payment[target] > this.getAvailableUnits(target)) {
          this.warning = `You do not have enough ${target}`;
          return;
        }
      }
      const requiredAmt = this.playerinput.amount || 0;
      if (requiredAmt > 0 && totalSpent < requiredAmt) {
        this.warning = 'Haven\'t spent enough';
        return;
      }

      // This following line was introduced in https://github.com/terraforming-mars/terraforming-mars/pull/2353
      //
      // According to bafolts@: I think this is an attempt to fix user error. This was added when the UI was
      // updated to allow paying with heat. Guessing this was trying to avoid taking the heat or megaCredits
      // from user when nothing is required. Can probably remove this if server only removes what is required.
      if (requiredAmt === 0) {
        this.payment.heat = 0;
        this.payment.megaCredits = 0;
      }

      if (requiredAmt > 0 && totalSpent > requiredAmt) {
        const diff = totalSpent - requiredAmt;
        for (const target of PAYMENT_UNITS) {
          if (this.payment[target] && diff >= this.getResourceRate(target)) {
            this.warning = `You cannot overspend ${target}`;
            return;
          }
        }
      }
      const showAlert = getPreferences().show_alerts;

      if (requiredAmt > 0 && totalSpent > requiredAmt && showAlert) {
        const diff = totalSpent - requiredAmt;

        if (!confirm('Warning: You are overpaying by ' + diff + ' M€')) {
          this.warning = 'Please adjust payment amount';
          return;
        }
      }
      this.onsave({type: 'payment', payment: this.payment});
    },
  },
});
</script>
<template>
<div class="payments_cont">
  <section v-trim-whitespace>
    <h3 class="payments_title">{{ $t(playerinput.title) }}</h3>

    <div class="payments_type input-group" v-if="canUse('steel')">
      <i class="resource_icon resource_icon--steel payments_type_icon" :title="$t('Pay with Steel')"></i>
      <AppButton type="minus" @click="reduceValue('steel', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.steel" />
      <AppButton type="plus" @click="addValue('steel', 1)" />
      <AppButton type="max" @click="setMaxValue('steel')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUse('titanium')">
      <i class="resource_icon resource_icon--titanium payments_type_icon" :title="$t('Pay with Titanium')"></i>
      <AppButton type="minus" @click="reduceValue('titanium', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.titanium" />
      <AppButton type="plus" @click="addValue('titanium', 1)" />
      <AppButton type="max" @click="setMaxValue('titanium')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUse('heat')">
      <i class="resource_icon resource_icon--heat payments_type_icon" :title="$t('Pay with Heat')"></i>
      <AppButton type="minus" @click="reduceValue('heat', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.heat" />
      <AppButton type="plus" @click="addValue('heat', 1)" />
      <AppButton type="max" @click="setMaxValue('heat')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUse('seeds')">
      <i class="resource_icon resource_icon--seed payments_type_icon" :title="$t('Pay with Seeds')"></i>
      <AppButton type="minus" @click="reduceValue('seeds', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.seeds" />
      <AppButton type="plus" @click="addValue('seeds', 1)" />
      <AppButton type="max" @click="setMaxValue('seeds')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUse('auroraiData')">
      <i class="resource_icon resource_icon--data payments_type_icon" :title="$t('Pay with Data')"></i>
      <AppButton type="minus" @click="reduceValue('auroraiData', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.auroraiData" />
      <AppButton type="plus" @click="addValue('auroraiData', 1)" />
      <AppButton type="max" @click="setMaxValue('auroraiData')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUse('kuiperAsteroids')">
      <i class="resource_icon resource_icon--asteroid payments_type_icon" :title="$t('Pay with Asteroids')"></i>
      <AppButton type="minus" @click="reduceValue('kuiperAsteroids', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.kuiperAsteroids" />
      <AppButton type="plus" @click="addValue('kuiperAsteroids', 1)" />
      <AppButton type="max" @click="setMaxValue('kuiperAsteroids')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUse('spireScience')">
      <i class="resource_icon resource_icon--science payments_type_icon" :title="$t('Pay with Science')"></i>
      <AppButton type="minus" @click="reduceValue('spireScience', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.spireScience" />
      <AppButton type="plus" @click="addValue('spireScience', 1)" />
      <AppButton type="max" @click="setMaxValue('spireScience')" title="MAX" />
    </div>

    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" :title="$t('Pay with Megacredits')"></i>
      <AppButton type="minus" @click="reduceValue('megaCredits', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="payment.megaCredits" />
      <AppButton type="plus" @click="addValue('megaCredits', 1)" />
      <AppButton type="max" @click="setMaxMCValue()" title="MAX" />
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <AppButton size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" data-test="save" />
    </div>

  </section>
</div>
</template>
