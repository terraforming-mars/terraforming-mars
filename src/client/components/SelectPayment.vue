<script lang="ts">
import Vue from 'vue';
import {Payment} from '@/common/inputs/Payment';
import {SpendableResource} from '@/common/inputs/Spendable';
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
    SPENDABLE_RESOURCES(): ReadonlyArray<SpendableResource> {
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
      this.cost = this.playerinput.amount;
      this.payment.megaCredits = this.getMegaCreditsMax();
      this.setDefaultValues();
    });
  },
  methods: {
    ...PaymentWidgetMixin.methods,
    hasWarning() {
      return this.warning !== undefined;
    },
    setDefaultValue(
      mcAlreadyCovered: number, // MC values of prior-computed resources.
      resource: SpendableResource): number {
      if (!this.canUse(resource)) {
        return 0;
      }
      const availableUnits = this.getAvailableUnits(resource);
      if (availableUnits === 0) {
        return 0;
      }

      const cost = this.cost;
      const targetResourceRate = this.getResourceRate(resource);

      // Compute the required minimum quantity needed to contribute.
      let contributingUnits = Math.ceil(Math.max(cost - this.getAvailableUnits('megaCredits') - mcAlreadyCovered, 0) / targetResourceRate);
      contributingUnits = Math.min(contributingUnits, availableUnits);
      let contributingMCValue = contributingUnits * targetResourceRate;

      // When greedy, use as much as possible without overspending. When selfish, use as little as possible
      const greedy = resource !== 'heat';
      if (greedy === true) {
        while (contributingUnits < availableUnits && contributingMCValue <= cost - targetResourceRate) {
          contributingUnits++;
          contributingMCValue += targetResourceRate;
        }
      }

      this.payment[resource] = contributingUnits;
      return contributingMCValue;
    },
    setDefaultValues(reserveMegacredits: boolean = false) {
      const cost = this.cost;

      const megaCredits = this.getAvailableUnits('megaCredits');

      let amountCovered = reserveMegacredits ? megaCredits : 0;
      for (const resource of ['seeds', 'auroraiData', 'steel', 'titanium', 'heat', 'spireScience'] as const) {
        amountCovered += this.setDefaultValue(amountCovered, resource);
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
    canUse(resource: SpendableResource): boolean {
      if (resource === 'megaCredits') {
        return true;
      }
      if (resource === 'titanium') {
        if (this.thisPlayer.titanium === 0) {
          return false;
        }
        return this.playerinput.paymentOptions.titanium === true|| this.playerinput.paymentOptions.lunaTradeFederationTitanium === true;
      }
      return this.playerinput.paymentOptions[resource] === true && this.hasUnits(resource);
    },
    saveData() {
      if (this.validatePayment(getPreferences().show_alerts) === true) {
        this.onsave({type: 'payment', payment: this.payment});
      }
    },
    onMaxClicked(resource: SpendableResource) {
      if (resource === 'megaCredits') {
        this.setMaxMCValue();
      } else {
        this.setMaxValue(resource);
      }
    },
  },
});

</script>
<template>
<div class="payments_cont">
  <section v-trim-whitespace>
    <h3 class="payments_title">{{ $t(playerinput.title) }}</h3>

    <template v-for="resource of SPENDABLE_RESOURCES">
      <payment-unit-component
        v-model.number="payment[resource]"
        v-bind:key="resource"
        v-if="canUse(resource) === true"
        :resource="resource"
        :description="descriptions[resource]"
        @plus="addValue(resource)"
        @minus="reduceValue(resource)"
        @max="onMaxClicked(resource)">
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
