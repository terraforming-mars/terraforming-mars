<!-- TODO(ryoku): merge with other party rendering code -->
<template>
  <div>

    <template v-if="id === 'mfp01'">
      <div class="policy-top-margin"><div v-if="partyName !== undefined" :class="'party-badge party-badge--mars_first'" v-i18n></div><div class="tile empty-tile-small"></div> : <span class="steel resource"></span></div>
    </template>
    <template v-else-if="id === 'sp01'">
      <span v-if="partyName !== undefined" :class="'party-badge party-badge--scientists'" v-i18n></span>
      <span class="money resource">10</span>
      <span class="red-arrow"></span>
      <span class="card card-with-border resource party-resource"></span>
      <span class="card card-with-border resource party-resource"></span>
      <span class="card card-with-border resource party-resource"></span>
    </template>
    <template v-else-if="id === 'up01'">
      <div class="policy-top-margin"><div v-if="partyName !== undefined" :class="'party-badge party-badge--unity'" v-i18n></div><div class="resource titanium"></div> : + <div class="resource money">1</div></div>
    </template>
    <template v-else-if="id === 'kp01'">
      <span v-if="partyName !== undefined" :class="'party-badge party-badge--kelvinists'" v-i18n></span>
      <span class="money resource">10</span>
      <span class="red-arrow-infinity"></span>
      <div class="production-box production-box-size2">
        <div class="energy production"></div>
        <div class="heat production"></div>
      </div>
    </template>
    <template v-else-if="id === 'rp01'">
      <div class="policy-top-margin">
      <div v-if="partyName !== undefined" :class="'party-badge party-badge--reds'" v-i18n></div>
      <div class="rating tile"></div> :
      <div class="resource money">-3</div>
      </div>
    </template>
    <template v-else-if="id === 'gp01'">
      <div v-if="partyName !== undefined" :class="'party-badge party-badge--greens'" v-i18n></div>
      <div class="tile greenery-tile"></div> : <div class="resource money">4</div>
    </template>
    <template v-else>
      <div>Unknown agenda ID {{id}}</div>
    </template>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';

export default Vue.extend({
  name: 'agenda',
  props: {
    id: {
      type: String as () => string,
    },
    partyName: {
      type: String as () => string,
    },
  },
});

</script>

