<script lang="ts">
import Vue from 'vue';
import {Payment} from '@/common/inputs/Payment';
import {SpendableResource, SPENDABLE_RESOURCES} from '@/common/inputs/Spendable';
import {PaymentWidgetMixin, SelectPaymentDataModel} from '@/client/mixins/PaymentWidgetMixin';
import {SelectPaymentModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectPaymentResponse} from '@/common/inputs/InputResponse';
import PaymentUnitComponent from '@/client/components/PaymentUnit.vue';

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
    ...PaymentWidgetMixin.computed,
    thisPlayer(): PublicPlayerModel {
      return this.playerView.thisPlayer;
    },
    SPENDABLE_RESOURCES(): ReadonlyArray<keyof Payment> {
      return [
        'steel',
        'titanium',
        'heat',
        'seeds',
        'auroraiData',
        'kuiperAsteroids',
        'spireScience',
        'megaCredits',
      ];
    },
  },
  components: {
    AppButton,
    PaymentUnitComponent,
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
      unit: SpendableResource): number {
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
    canUse(unit: SpendableResource): boolean {
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
      for (const target of SPENDABLE_RESOURCES) {
        totalSpent += this.payment[target] * this.getResourceRate(target);
      }

      for (const target of SPENDABLE_RESOURCES) {
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
        for (const target of SPENDABLE_RESOURCES) {
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
    onMaxClicked(unit: SpendableResource) {
      if (unit === 'megaCredits') {
        this.setMaxMCValue();
      } else {
        this.setMaxValue(unit);
      }
    },
  },
});

</script>
<template>
<div class="payments_cont">
  <section v-trim-whitespace>
    <h3 class="payments_title">{{ $t(playerinput.title) }}</h3>

    <template v-for="unit of SPENDABLE_RESOURCES">
      <payment-unit-component
        v-model.number="payment[unit]"
        v-bind:key="unit"
        v-if="canUse(unit) === true"
        :unit="unit"
        :description="descriptions[unit]"
        @plus="addValue(unit)"
        @minus="reduceValue(unit)"
        @max="onMaxClicked(unit)">
      </payment-unit-component>
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
