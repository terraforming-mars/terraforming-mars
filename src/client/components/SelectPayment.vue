<script lang="ts">
import Vue from 'vue';
import {Payment} from '@/common/inputs/Payment';
import {PaymentWidgetMixin, SelectPaymentModel, Unit} from '@/client/mixins/PaymentWidgetMixin';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {getPreferences} from '@/client/utils/PreferencesManager';
import Button from '@/client/components/common/Button.vue';
import {InputResponse} from '@/common/inputs/InputResponse';

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
  components: {
    Button,
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
      data: 0,
      warning: undefined,
    };
  },
  mounted() {
    Vue.nextTick(() => {
      this.setInitialCost();
      this.$data.megaCredits = this.getMegaCreditsMax();
      this.setDefaultValues();
    });
  },
  methods: {
    ...PaymentWidgetMixin.methods,
    hasWarning() {
      return this.$data.warning !== undefined;
    },
    setInitialCost() {
      this.$data.cost = this.playerinput.amount;
    },
    canUse(target: Unit) {
      switch (target) {
      case 'steel': return this.canUseSteel();
      case 'titanium': return this.canUseTitanium();
      case 'heat': return this.canUseHeat();
      case 'seeds': return this.canUseSeeds();
      case 'data': return this.canUseData();
      }
      return false;
    },
    setDefaultValue(
      amountCovered: number, // MC values of prior-computed resources.
      target: Unit): number {
      if (!this.canUse(target)) return 0;
      const amount = this.getAmount(target);
      if (amount === 0) return 0;

      const cost = this.$data.cost;
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
      const cost = this.$data.cost;

      const megaCredits = this.getAmount('megaCredits');

      const targets: Array<Unit> = ['seeds', 'data', 'steel', 'titanium', 'heat'];
      let amountCovered = reserveMegacredits ? megaCredits : 0;
      for (const target of targets) {
        amountCovered += this.setDefaultValue(amountCovered, target);
      }
      if (!reserveMegacredits) {
        this.$data.megaCredits = Math.min(megaCredits, Math.max(cost - amountCovered, 0));
      }
    },
    setMaxMCValue() {
      this.setMaxValue('megaCredits');
      this.setDefaultValues(/* reserveMegacredits */ true);
    },
    canAffordWithMcOnly() {
      return this.thisPlayer.megaCredits >= this.$data.cost;
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
      return this.playerinput.canUseData && (this.playerinput.data ?? 0 > 0);
    },

    saveData() {
      const targets: Array<Unit> = ['seeds', 'data', 'steel', 'titanium', 'heat', 'megaCredits'];

      const payment: Payment = {
        heat: this.$data.heat,
        megaCredits: this.$data.megaCredits,
        steel: this.$data.steel,
        titanium: this.$data.titanium,
        seeds: this.$data.seeds,
        data: this.$data.data,
        microbes: 0,
        floaters: 0,
        science: 0,
      };

      let totalSpent = 0;
      for (const target of targets) {
        if (payment[target] > this.getAmount(target)) {
          this.$data.warning = `You do not have enough ${target}`;
          return;
        }
        totalSpent += payment[target] * this.getResourceRate(target);
      }

      const requiredAmt = this.playerinput.amount || 0;

      if (requiredAmt > 0 && totalSpent < requiredAmt) {
        this.$data.warning = 'Haven\'t spent enough';
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
            this.$data.warning = `You cannot overspend ${target}`;
            return;
          }
        }
      }
      const showAlert = getPreferences().show_alerts;

      if (requiredAmt > 0 && totalSpent > requiredAmt && showAlert) {
        const diff = totalSpent - requiredAmt;

        if (!confirm('Warning: You are overpaying by ' + diff + ' M€')) {
          this.$data.warning = 'Please adjust payment amount';
          return;
        }
      }
      this.onsave([[JSON.stringify(payment)]]);
    },
  },
});
</script>
<template>
<div class="payments_cont">
  <section v-trim-whitespace>
    <h3 class="payments_title">{{ $t(playerinput.title) }}</h3>

    <div class="payments_type input-group" v-if="playerinput.canUseSteel">
      <i class="resource_icon resource_icon--steel payments_type_icon" :title="$t('Pay by Steel')"></i>
      <Button type="minus" @click="reduceValue('steel', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <Button type="plus" @click="addValue('steel', 1)" />
      <Button type="max" @click="setMaxValue('steel')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseTitanium || canUseLunaTradeFederationTitanium()">
      <i class="resource_icon resource_icon--titanium payments_type_icon" :title="$t('Pay by Titanium')"></i>
      <Button type="minus" @click="reduceValue('titanium', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <Button type="plus" @click="addValue('titanium', 1)" />
      <Button type="max" @click="setMaxValue('titanium')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseHeat">
      <i class="resource_icon resource_icon--heat payments_type_icon" :title="$t('Pay by Heat')"></i>
      <Button type="minus" @click="reduceValue('heat', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="heat" />
      <Button type="plus" @click="addValue('heat', 1)" />
      <Button type="max" @click="setMaxValue('heat')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseSeeds">
      <i class="resource_icon resource_icon--seed payments_type_icon" :title="$t('Pay by Seeds')"></i>
      <Button type="minus" @click="reduceValue('seeds', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="seeds" />
      <Button type="plus" @click="addValue('seeds', 1)" />
      <Button type="max" @click="setMaxValue('seeds')" title="MAX" />
    </div>

    <div class="payments_type input-group" v-if="playerinput.canUseData">
      <i class="resource_icon resource_icon--data payments_type_icon" :title="$t('Pay by Data')"></i>
      <Button type="minus" @click="reduceValue('data', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="data" />
      <Button type="plus" @click="addValue('data', 1)" />
      <Button type="max" @click="setMaxValue('data')" title="MAX" />
    </div>

    <div class="payments_type input-group">
      <i class="resource_icon resource_icon--megacredits payments_type_icon" :title="$t('Pay by Megacredits')"></i>
      <Button type="minus" @click="reduceValue('megaCredits', 1)" />
      <input class="form-input form-inline payments_input" v-model.number="megaCredits" />
      <Button type="plus" @click="addValue('megaCredits', 1)" />
      <Button type="max" @click="setMaxMCValue()" title="MAX" />
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="payments_save">
      <Button size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
    </div>

  </section>
</div>
</template>
