<template>
  <div class="payments_type input-group" :data-test="unit">
    <i class="resource_icon payments_type_icon" :class="iconClass" @click="$emit('plus')" :title="$t('Pay with ' + description)"></i>
    <AppButton type="minus" @click="$emit('minus')" />
    <input
      class="form-input form-inline payments_input"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    />
    <AppButton type="plus" @click="$emit('plus')" />
    <AppButton type="max" @click="$emit('max')" title="MAX" v-if="showMax" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {PaymentWidgetMixin} from '@/client/mixins/PaymentWidgetMixin';
import AppButton from '@/client/components/common/AppButton.vue';
import {SpendableResource} from '@/common/inputs/Spendable';

export default Vue.extend({
  name: 'PaymentUnitComponent',
  props: {
    value: {
      type: Number,
    },
    unit: {
      type: String as () => SpendableResource,
    },
    description: {
      type: String,
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
  methods: {
    ...PaymentWidgetMixin.methods,
  },
  computed: {
    iconClass(): string {
      switch (this.unit) {
      case 'kuiperAsteroids': return 'resource_icon--asteroid';
      case 'lunaArchivesScience': return 'resource_icon--science';
      case 'spireScience': return 'resource_icon--science';
      case 'seeds': return 'resource_icon--seed';
      // TODO(kberg): remove toLowerCase
      default: return 'resource_icon--' + this.unit.toLowerCase();
      }
    },
  },
});
</script>
