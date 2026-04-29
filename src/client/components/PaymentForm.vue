<template>
<section v-trim-whitespace>
  <template v-for="unit of order" :key="unit">
    <div v-if="ledger[unit]?.available > 0">
      <payment-unit-component
        v-model.number="localPayment[unit]"
        :unit="unit"
        :description="descriptions[unit]"
        @plus="addValue(unit)"
        @minus="reduceValue(unit)"
        @max="onMax(unit)">
      </payment-unit-component>
      <div v-if="ledger[unit]?.reserved" class="card-warning" v-i18n="$t(unit)">
        Some ${0} are reserved and unavailable here.
      </div>
    </div>
  </template>

  <div v-if="warning !== undefined" class="tm-warning">
    <label class="label label-error">{{ $t(warning) }}</label>
  </div>

  <div v-if="showsave" class="payments_save">
    <AppButton size="big" @click="handleSave()" :title="$t(buttonLabel)" data-test="save"/>
  </div>
</section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Payment} from '@/common/inputs/Payment';
import {SpendableResource} from '@/common/inputs/Spendable';
import {getPreferences} from '@/client/utils/PreferencesManager';
import AppButton from '@/client/components/common/AppButton.vue';
import PaymentUnitComponent from '@/client/components/PaymentUnit.vue';
import {Ledger} from '@/client/components/PaymentLedger';
import {computeDefaultPayment} from '@/client/components/PaymentDefaults';

const DESCRIPTIONS: Record<SpendableResource, string> = {
  steel: 'Steel',
  titanium: 'Titanium',
  heat: 'Heat',
  seeds: 'Seeds',
  auroraiData: 'Data',
  kuiperAsteroids: 'Asteroids',
  spireScience: 'Science',
  megacredits: 'M€',
  floaters: 'Floaters',
  graphene: 'Graphene',
  lunaArchivesScience: 'Science',
  microbes: 'Microbes',
  plants: 'Plants',
};

export default defineComponent({
  name: 'PaymentForm',
  components: {
    AppButton,
    PaymentUnitComponent,
  },
  props: {
    initialPayment: {
      type: Object as () => Payment,
      default: undefined,
    },
    cost: {
      type: Number,
      required: true,
    },
    order: {
      type: Array as () => ReadonlyArray<SpendableResource>,
      required: true,
    },
    ledger: {
      type: Object as () => Ledger,
      required: true,
    },
    showsave: {
      type: Boolean,
      default: false,
    },
    buttonLabel: {
      type: String,
      required: true,
    },
  },
  emits: ['save'],
  data() {
    return {
      localPayment: {...(this.initialPayment ?? Payment.EMPTY)} as Payment,
      warning: undefined as string | undefined,
    };
  },
  created() {
    if (this.initialPayment === undefined) {
      Object.assign(this.localPayment, computeDefaultPayment(this.cost, this.order, this.ledger));
    }
  },
  computed: {
    descriptions(): Record<SpendableResource, string> {
      return DESCRIPTIONS;
    },
  },
  methods: {
    getPayment(): Payment {
      return {...this.localPayment};
    },
    getMegaCreditsMax(): number {
      return Math.min(this.ledger['megacredits'].available, this.cost);
    },
    addValue(unit: SpendableResource): void {
      const payment = this.localPayment;
      const currentValue = payment[unit] ?? 0;
      const maxValue = unit === 'megacredits' ? this.getMegaCreditsMax() : this.ledger[unit].available;
      const delta = Math.min(1, maxValue - currentValue);
      if (delta <= 0) return;
      payment[unit] += delta;
      if (unit !== 'megacredits') this.setRemainingMCValue();
    },
    reduceValue(unit: SpendableResource): void {
      const payment = this.localPayment;
      const adjustedDelta = Math.min(1, payment[unit] ?? 0);
      if (adjustedDelta === 0) return;
      payment[unit] -= adjustedDelta;
      if (unit !== 'megacredits') this.setRemainingMCValue();
    },
    setRemainingMCValue(): void {
      let remainingMC = this.cost;
      for (const unit of this.order) {
        if (unit === 'megacredits') {
          continue;
        }
        remainingMC -= (this.localPayment[unit] ?? 0) * this.ledger[unit].value;
      }
      this.localPayment.megacredits = Math.max(0, Math.min(this.getMegaCreditsMax(), remainingMC));
    },
    setMaxValue(unit: SpendableResource): void {
      const target = Math.min(this.ledger[unit].available, Math.floor(this.cost / this.ledger[unit].value));
      if ((this.localPayment[unit] ?? 0) < target) {
        this.localPayment[unit] = target;
        if (unit !== 'megacredits') this.setRemainingMCValue();
      }
    },
    onMax(unit: SpendableResource): void {
      this.setMaxValue(unit);
      if (unit === 'megacredits') {
        const overrides = {
          ...computeDefaultPayment(this.cost, this.order, this.ledger, true),
          megacredits: this.localPayment.megacredits,
        };
        Object.assign(this.localPayment, overrides);
      }
    },
    computeTotalSpent(): number {
      let total = 0;
      for (const unit of this.order) {
        total += (this.localPayment[unit] ?? 0) * this.ledger[unit].value;
      }
      return total;
    },
    handleSave(): void {
      this.warning = undefined;
      if (this.cost === 0) {
        this.$emit('save', {...this.localPayment});
        return;
      }
      const totalSpent = this.computeTotalSpent();
      for (const unit of this.order) {
        if ((this.localPayment[unit] ?? 0) > this.ledger[unit].available) {
          this.warning = `You do not have enough ${unit}`;
          return;
        }
      }
      if (totalSpent < this.cost) {
        this.warning = 'Haven\'t spent enough';
        return;
      }
      if (totalSpent > this.cost) {
        const diff = totalSpent - this.cost;
        for (const unit of this.order) {
          if (this.localPayment[unit] && diff >= this.ledger[unit].value) {
            this.warning = `You cannot overspend ${unit}`;
            return;
          }
        }
      }
      if (totalSpent > this.cost && getPreferences().show_alerts) {
        if (!confirm('Warning: You are overpaying by ' + (totalSpent - this.cost) + ' M€')) {
          this.warning = 'Please adjust payment amount';
          return;
        }
      }
      this.$emit('save', {...this.localPayment});
    },
  },
});
</script>
