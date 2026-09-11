<template>
  <div class="payments-type input-group" :data-test="unit">
    <i class="resource-icon payments-type-icon" :class="iconClass" @click="$emit('plus')" :title="$t('Pay with ' + description)"></i>
    <AppButton type="minus" @click="$emit('minus')" />
    <input
      class="form-input form-inline payments-input"
      :value="count"
      @input="onInput"
    >
    <AppButton type="plus" @click="$emit('plus')" />
    <AppButton type="max" @click="$emit('max')" title="MAX" v-if="showMax" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SpendableResource} from '@/common/inputs/Spendable';

export default defineComponent({
  name: 'PaymentUnitComponent',
  emits: ['plus', 'minus', 'max', 'update:count'],
  props: {
    count: {
      type: Number,
      required: true,
    },
    unit: {
      type: String as () => SpendableResource,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    showMax: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  components: {
    AppButton,
  },
  computed: {
    iconClass(): string {
      switch (this.unit) {
      case 'kuiperAsteroids': return 'resource-icon--asteroid';
      case 'lunaArchivesScience': return 'resource-icon--science';
      case 'spireScience': return 'resource-icon--science';
      case 'auroraiData': return 'resource-icon--auroraidata';
      case 'seeds': return 'resource-icon--seed';
      default: return 'resource-icon--' + this.unit;
      }
    },
  },
  methods: {
    onInput(event: Event) {
      this.$emit('update:count', (event.target as HTMLInputElement).value);
    },
  },
});
</script>
