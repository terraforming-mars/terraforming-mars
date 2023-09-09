<script lang="ts">
import Vue from 'vue';
import {Payment, PaymentKey} from '@/common/inputs/Payment';
import {PaymentWidgetMixin, SelectPaymentModel} from '@/client/mixins/PaymentWidgetMixin';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
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
      type: Object as () => PlayerInputModel,
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
  data(): SelectPaymentModel {
    return {
      cost: 0,
      heat: 0,
      megaCredits: 0,
      steel: 0,
      titanium: 0,
      microbes: 0,
      floaters: 0,
      seeds: 0,
      auroraiData: 0,
      warning: undefined,
    };
  },
  mounted() {
    Vue.nextTick(() => {
      this.setInitialCost();
      this.megaCredits = this.getMegaCreditsMax();
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
    canUse(target: PaymentKey) {
      switch (target) {
      case 'steel': return this.canUseSteel();
      case 'titanium': return this.canUseTitanium();
      case 'heat': return this.canUseHeat();
      case 'seeds': return this.canUseSeeds();
      case 'auroraiData': return this.canUseData();
      }
      return false;
    },
    setDefaultValue(
      amountCovered: number, // MC values of prior-computed resources.
      target: PaymentKey): number {
      if (!this.canUse(target)) return 0;
      const amount = this.getAmount(target);
      if (amount === 0) return 0;

      const cost = this.cost;
      const resourceRate = this.getResourceRate(target);

      let qty = Math.ceil(Math.max(cost - this.getAmount('megaCredits') - amountCovered, 0) / resourceRate);
      qty = Math.min(qty, amount);
      let contributingValue = qty * resourceRate;

      // When greedy, use as much as possible without overspending. When selfish, use as little as possible
      const greedy = target !== 'heat';
      if (greedy === true) {
        while (qty < amount && contributingValue <= cost - resourceRate) {
          qty++;
          contributingValue += resourceRate;
        }
      }

      this.$data[target] = qty;
      return contributingValue;
    },
    setDefaultValues(reserveMegacredits: boolean = false) {
      const cost = this.cost;

      const megaCredits = this.getAmount('megaCredits');

      const targets: Array<PaymentKey> = ['seeds', 'auroraiData', 'steel', 'titanium', 'heat'];
      let amountCovered = reserveMegacredits ? megaCredits : 0;
      for (const target of targets) {
        amountCovered += this.setDefaultValue(amountCovered, target);
      }
      if (!reserveMegacredits) {
        this.megaCredits = Math.min(megaCredits, Math.max(cost - amountCovered, 0));
      }
    },
    setMaxMCValue() {
      this.setMaxValue('megaCredits');
      this.setDefaultValues(/* reserveMegacredits */ true);
    },
    canAffordWithMcOnly() {
      return this.thisPlayer.megaCredits >= this.cost;
    },
    canUseHeat() {
      return this.playerinput.canUseHeat && this.availableHeat() > 0;
    },
    canUseSteel() {
      return this.playerinput.canUseSteel && this.thisPlayer.steel > 0;
    },
    canUseTitanium() {
      return this.playerinput.canUseTitanium && this.thisPlayer.titanium > 0;
    },
    canUseLunaTradeFederationTitanium() {
      return this.playerinput.canUseLunaTradeFederationTitanium && this.thisPlayer.titanium > 0;
    },
    canUseSeeds() {
      return this.playerinput.canUseSeeds && (this.playerinput.seeds ?? 0 > 0);
    },
    canUseData() {
      return this.playerinput.canUseData && (this.playerinput.auroraiData ?? 0 > 0);
    },
    canUseGraphene() {
      return this.playerinput.canUseGraphene && (this.playerinput.graphene ?? 0 > 0);
    },

    saveData() {
      const targets: Array<PaymentKey> = ['seeds', 'auroraiData', 'steel', 'titanium', 'heat', 'megaCredits'];

      const payment: Payment = {
        ...Payment.EMPTY,
        heat: this.heat,
        megaCredits: this.megaCredits,
        steel: this.steel,
        titanium: this.titanium,
        seeds: this.seeds ?? 0,
        auroraiData: this.auroraiData ?? 0,
      };

      let totalSpent = 0;
      for (const target of targets) {
        if (payment[target] > this.getAmount(target)) {
          this.warning = `You do not have enough ${target}`;
          return;
        }
        totalSpent += payment[target] * this.getResourceRate(target);
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
        payment.heat = 0;
        payment.megaCredits = 0;
      }

      if (requiredAmt > 0 && totalSpent > requiredAmt) {
        const diff = totalSpent - requiredAmt;
        for (const target of targets) {
          if (payment[target] && diff >= this.getResourceRate(target)) {
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
      this.onsave({type: 'payment', payment: payment});
    },
  },
});
</script>
<template>
<div class="payments_cont">
  <section v-trim-whitespace>
    <h3 class="payments_title">{{ $t(playerinput.title) }}</h3>

    <div class="payments_type input-group" v-if="canUseSteel()">
      <i class="resource_icon resource_icon--steel payments_type_icon" :title="$t('Pay by Steel')"></i>
      <AppButton type="minus" @click="reduceValue('steel', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <AppButton type="plus" @click="addValue('steel', 1)" />
      <AppButton type="max" @click="setMaxValue('steel')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseTitanium() || canUseLunaTradeFederationTitanium()">
      <i class="resource_icon resource_icon--titanium payments_type_icon" :title="$t('Pay by Titanium')"></i>
      <AppButton type="minus" @click="reduceValue('titanium', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <AppButton type="plus" @click="addValue('titanium', 1)" />
      <AppButton type="max" @click="setMaxValue('titanium')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseHeat()">
      <i class="resource_icon resource_icon--heat payments_type_icon" :title="$t('Pay by Heat')"></i>
      <AppButton type="minus" @click="reduceValue('heat', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <AppButton type="plus" @click="addValue('heat', 1)" />
      <AppButton type="max" @click="setMaxValue('heat')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseSeeds()">
      <i class="resource_icon resource_icon--seed payments_type_icon" :title="$t('Pay by Seeds')"></i>
      <AppButton type="minus" @click="reduceValue('seeds', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="seeds" />
      <AppButton type="plus" @click="addValue('seeds', 1)" />
      <AppButton type="max" @click="setMaxValue('seeds')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="canUseData()">
      <i class="resource_icon resource_icon--data payments_type_icon" :title="$t('Pay by Data')"></i>
      <AppButton type="minus" @click="reduceValue('auroraiData', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="auroraiData" />
      <AppButton type="plus" @click="addValue('auroraiData', 1)" />
      <AppButton type="max" @click="setMaxValue('auroraiData')" title="MAX" />
    </div>

    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" :title="$t('Pay by Megacredits')"></i>
      <AppButton type="minus" @click="reduceValue('megaCredits', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="megaCredits" />
      <AppButton type="plus" @click="addValue('megaCredits', 1)" />
      <AppButton type="max" @click="setMaxMCValue()" title="MAX" />
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <AppButton size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
    </div>

  </section>
</div>
</template>
