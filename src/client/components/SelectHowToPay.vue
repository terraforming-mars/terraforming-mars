<script lang="ts">
import Vue from 'vue';
import {HowToPay} from '@/inputs/HowToPay';
import {PaymentWidgetMixin, SelectHowToPayModel} from '@/client/mixins/PaymentWidgetMixin';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import Button from '@/client/components/common/Button.vue';

export default Vue.extend({
  name: 'SelectHowToPay',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => PlayerInputModel,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
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
  data() {
    return {
      cost: 0,
      heat: 0,
      megaCredits: 0,
      steel: 0,
      titanium: 0,
      microbes: 0,
      floaters: 0,
      warning: undefined,
    } as SelectHowToPayModel;
  },
  mounted() {
    Vue.nextTick(() => {
      this.setInitialCost();
      this.$data.megaCredits = (this as any).getMegaCreditsMax();

      this.setDefaultSteelValue();
      this.setDefaultTitaniumValue();
      this.setDefaultHeatValue();
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
    setDefaultSteelValue() {
      // automatically use available steel to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseSteel()) {
        let requiredSteelQty = Math.ceil(Math.max(this.$data.cost - this.thisPlayer.megaCredits, 0) / this.thisPlayer.steelValue);

        if (requiredSteelQty > this.thisPlayer.steel) {
          this.$data.steel = this.thisPlayer.steel;
        } else {
          // use as much steel as possible without overpaying by default
          let currentSteelValue = requiredSteelQty * this.thisPlayer.steelValue;
          while (currentSteelValue <= this.$data.cost - this.thisPlayer.steelValue && requiredSteelQty < this.thisPlayer.steel) {
            requiredSteelQty++;
            currentSteelValue = requiredSteelQty * this.thisPlayer.steelValue;
          }

          this.$data.steel = requiredSteelQty;
        }

        const discountedCost = this.$data.cost - (this.$data.steel * this.thisPlayer.steelValue);
        this.$data.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.$data.steel = 0;
      }
    },
    setDefaultTitaniumValue() {
      // automatically use available titanium to pay if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseTitanium()) {
        let requiredTitaniumQty = Math.ceil(Math.max(this.$data.cost - this.thisPlayer.megaCredits - (this.$data.steel * this.thisPlayer.steelValue), 0) / this.thisPlayer.titaniumValue);

        if (requiredTitaniumQty > this.thisPlayer.titanium) {
          this.$data.titanium = this.thisPlayer.titanium;
        } else {
          // use as much titanium as possible without overpaying by default
          let currentTitaniumValue = requiredTitaniumQty * this.thisPlayer.titaniumValue;
          while (currentTitaniumValue <= this.$data.cost - this.thisPlayer.titaniumValue && requiredTitaniumQty < this.thisPlayer.titanium) {
            requiredTitaniumQty++;
            currentTitaniumValue = requiredTitaniumQty * this.thisPlayer.titaniumValue;
          }

          this.$data.titanium = requiredTitaniumQty;
        }

        const discountedCost = this.$data.cost - (this.$data.steel * this.thisPlayer.steelValue) - (this.$data.titanium * this.thisPlayer.titaniumValue);
        this.$data.megaCredits = Math.max(discountedCost, 0);
      } else {
        this.$data.titanium = 0;
      }
    },
    setDefaultHeatValue() {
      // automatically use available heat for Helion if not enough MC
      if (!this.canAffordWithMcOnly() && this.canUseHeat()) {
        this.$data.heat = Math.max(this.$data.cost - this.thisPlayer.megaCredits - (this.$data.steel * this.thisPlayer.steelValue) - (this.$data.titanium * this.thisPlayer.titaniumValue), 0);
      } else {
        this.$data.heat = 0;
      }
      const discountedCost = this.$data.cost - (this.$data.steel * this.thisPlayer.steelValue) - (this.$data.titanium * this.thisPlayer.titaniumValue) - this.$data.heat;
      this.$data.megaCredits = Math.max(discountedCost, 0);
    },
    canAffordWithMcOnly() {
      return this.thisPlayer.megaCredits >= this.$data.cost;
    },
    canUseHeat() {
      return this.playerinput.canUseHeat && this.thisPlayer.heat > 0;
    },
    canUseSteel() {
      return this.playerinput.canUseSteel && this.thisPlayer.steel > 0;
    },
    canUseTitanium() {
      return this.playerinput.canUseTitanium && this.thisPlayer.titanium > 0;
    },
    saveData() {
      const htp: HowToPay = {
        heat: this.$data.heat,
        megaCredits: this.$data.megaCredits,
        steel: this.$data.steel,
        titanium: this.$data.titanium,
        microbes: 0,
        floaters: 0,
        science: 0,
      };

      if (htp.megaCredits > this.thisPlayer.megaCredits) {
        this.$data.warning = 'You don\'t have that many M€';
        return;
      }
      if (htp.heat > this.thisPlayer.heat) {
        this.$data.warning = 'You don\'t have enough heat';
        return;
      }
      if (htp.titanium > this.thisPlayer.titanium) {
        this.$data.warning = 'You don\'t have enough titanium';
        return;
      }
      if (htp.steel > this.thisPlayer.steel) {
        this.$data.warning = 'You don\'t have enough steel';
        return;
      }

      const requiredAmt = this.playerinput.amount || 0;
      const totalSpentAmt = htp.heat + htp.megaCredits + (htp.steel * this.thisPlayer.steelValue) + (htp.titanium * this.thisPlayer.titaniumValue);

      if (requiredAmt > 0 && totalSpentAmt < requiredAmt) {
        this.$data.warning = 'Haven\'t spent enough';
        return;
      }

      if (requiredAmt === 0) {
        htp.heat = 0;
        htp.megaCredits = 0;
      }

      if (requiredAmt > 0 && totalSpentAmt > requiredAmt) {
        const diff = totalSpentAmt - requiredAmt;
        if (htp.titanium && diff >= this.thisPlayer.titaniumValue) {
          this.$data.warning = 'You cannot overspend titanium';
          return;
        }
        if (htp.steel && diff >= this.thisPlayer.steelValue) {
          this.$data.warning = 'You cannot overspend steel';
          return;
        }
        if (htp.heat && diff >= 1) {
          this.$data.warning = 'You cannot overspend heat';
          return;
        }
        if (htp.megaCredits && diff >= 1) {
          this.$data.warning = 'You cannot overspend megaCredits';
          return;
        }
      }

      const showAlert = PreferencesManager.load('show_alerts') === '1';

      if (requiredAmt > 0 && totalSpentAmt > requiredAmt && showAlert) {
        const diff = totalSpentAmt - requiredAmt;

        if (confirm('Warning: You are overpaying by ' + diff + ' M€')) {
          this.onsave([[JSON.stringify(htp)]]);
        } else {
          this.$data.warning = 'Please adjust payment amount';
          return;
        }
      } else {
        this.onsave([[JSON.stringify(htp)]]);
      }
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

    <div class="payments_type input-group" v-if="playerinput.canUseTitanium">
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
      <Button size="big" @click="saveData" :title="$t(playerinput.buttonLabel)" />
    </div>

  </section>
</div>
</template>
