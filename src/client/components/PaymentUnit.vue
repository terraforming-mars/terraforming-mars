<template>
  <div class="payments_type input-group" :data-test="unit">
    <i class="resource_icon payments_type_icon" :class="iconClass" @click="$emit('plus')" :title="$t('Pay with ' + description)"></i>
    <AppButton type="minus" @click="$emit('minus')" />
    <input
      class="form-input form-inline payments_input"
      v-bind:value="modelValue"
      v-on:input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <AppButton type="plus" @click="$emit('plus')" />
    <AppButton type="max" @click="$emit('max')" title="MAX" v-if="showMax" />
    <span v-if="value !== undefined">{{ value * modelValue }}</span><i v-if="value !== undefined" class="resource_icon payments_type_icon resource_icon--megacredits"></i>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SpendableResource} from '@/common/inputs/Spendable';

export default defineComponent({
  name: 'PaymentUnitComponent',
  props: {
    modelValue: {
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
    value: {
      type: Number as () => number | undefined,
      default: undefined,
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
      case 'kuiperAsteroids': return 'resource_icon--asteroid';
      case 'lunaArchivesScience': return 'resource_icon--science';
      case 'spireScience': return 'resource_icon--science';
      case 'auroraiData': return 'resource_icon--auroraidata';
      case 'seeds': return 'resource_icon--seed';
      default: return 'resource_icon--' + this.unit;
      }
    },
  },
});
</script>
