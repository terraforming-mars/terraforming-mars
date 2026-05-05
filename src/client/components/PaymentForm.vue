<template>
<section v-trim-whitespace>
  <template v-for="unit of order" :key="unit">
    <div v-if="ledger[unit]?.available > 0">
      <payment-unit-component
        v-model.number="payment[unit]"
        :unit="unit"
        :description="descriptions[unit]"
        :value="ledger[unit].value"
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

type DataModel = {
  payment: Payment;
  warning: string | undefined;
};

export default defineComponent({
  name: 'PaymentForm',
  components: {
    AppButton,
    PaymentUnitComponent,
  },
  props: {
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
  data(): DataModel {
    return {
      payment: computeDefaultPayment(this.cost, this.order, this.ledger, /* reserveMegacredits=*/ false),
      warning: undefined,
    };
  },
  computed: {
    descriptions(): Record<SpendableResource, string> {
      return DESCRIPTIONS;
    },
  },
  methods: {
    getPayment() {
      return this.payment;
    },
    getMegaCreditsMax(): number {
      return Math.min(this.ledger['megacredits'].available, this.cost);
    },
    addValue(unit: SpendableResource): void {
      const payment = this.payment;
      const currentValue = payment[unit];
      const maxValue = unit === 'megacredits' ? this.getMegaCreditsMax() : this.ledger[unit].available;
      if (currentValue < maxValue) {
        payment[unit] += 1;
        if (unit !== 'megacredits') {
          this.setRemainingMCValue();
        }
      }
    },
    reduceValue(unit: SpendableResource): void {
      const payment = this.payment;
      if (payment[unit] > 0) {
        payment[unit] -= 1;
        if (unit !== 'megacredits') {
          this.setRemainingMCValue();
        }
      }
    },
    setRemainingMCValue(): void {
      let remainingMC = this.cost;
      for (const unit of this.order) {
        if (unit === 'megacredits') {
          continue;
        }
        remainingMC -= this.payment[unit] * this.ledger[unit].value;
      }
      this.payment.megacredits = Math.max(0, Math.min(this.getMegaCreditsMax(), remainingMC));
    },
    setMaxValue(unit: SpendableResource): void {
      const target = Math.min(this.ledger[unit].available, Math.floor(this.cost / this.ledger[unit].value));
      if (this.payment[unit] < target) {
        this.payment[unit] = target;
        if (unit !== 'megacredits') {
          this.setRemainingMCValue();
        }
      }
    },
    onMax(unit: SpendableResource): void {
      this.setMaxValue(unit);
      const saved = this.payment.megacredits;
      if (unit === 'megacredits') {
        this.payment = computeDefaultPayment(this.cost, this.order, this.ledger, /* reserveMegacredits=*/ true);
        this.payment.megacredits = saved;
      }
    },
    computeTotalSpent(): number {
      let total = 0;
      for (const unit of this.order) {
        total += this.payment[unit] * this.ledger[unit].value;
      }
      return total;
    },
    handleSave(): void {
      this.warning = undefined;
      if (this.cost === 0) {
        this.$emit('save', this.payment);
        return;
      }
      const totalSpent = this.computeTotalSpent();
      for (const unit of this.order) {
        if (this.payment[unit] > this.ledger[unit].available) {
          // TODO(kberg): Make this a Message
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
          if (this.payment[unit] && diff >= this.ledger[unit].value) {
            // TODO(kberg): Make this a Message
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
      this.$emit('save', this.payment);
    },
  },
});
</script>
