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
  },
  components: {
    AppButton,
  },
  methods: {
    ...PaymentWidgetMixin.methods,
  },
});
</script>
<template>
  <div class="payments_type input-group" :data-test="unit">
    <!-- TODO(kberg): remove toLowerCase -->
    <i class="resource_icon payments_type_icon" :class="'resource_icon--' + unit.toLowerCase()"  :title="$t('Pay with ' + description)"></i>
    <AppButton type="minus" @click="$emit('minus')" />
    <input
      class="form-input form-inline payments_input"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    />
    <AppButton type="plus" @click="$emit('plus')" />
    <AppButton type="max" @click="$emit('max')" title="MAX" />
  </div>
</template>
