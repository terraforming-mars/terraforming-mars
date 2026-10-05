<template>
  <div class="discount-list">
    <div class="discount-list-title" v-i18n>* Additional discounts:</div>
    <table>
      <tr v-for="(discount, idx) in discounts" :key="idx">
        <td class="discount-list-amount"><div class="megacredits">-{{ discount.amount }}</div></td>
        <td class="discount-list-applies-to">{{ discount.appliesTo }}</td>
        <td class="discount-list-source">{{ $t(discount.source) }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import {DiscountSource} from '@/client/components/overview/discounts';

defineProps<{
  discounts: ReadonlyArray<DiscountSource>;
}>();
</script>

<style scoped lang="less">
.discount-list {
  background: #222;
  color: white;
  border-radius: 6px;
  padding: 4px;
  white-space: nowrap;
  font-size: 13px;
  box-shadow: 0 2px 6px black;
  td {
    padding: 2px 6px;
  }
}
.discount-list-title {
  padding: 2px 6px;
  font-weight: bold;
}
.megacredits {
  background-image: url(./assets/resources/megacredit.png);
  background-size: 20px 20px;
  width: 20px;
  height: 20px;
  color: black;
  font-size: 13px;
  font-family: Prototype, sans-serif;
  line-height: 20px;
  text-align: center;
}
.discount-list-source {
  color: #aaa;
}
</style>
