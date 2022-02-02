<template>
  <div :class="getClass">
    <template v-if="id === 'mb01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-building party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'mb02'">
      <div class="resource money party-resource">1</div> /
      <div class="tile empty-tile-small"></div>ON MARS
    </template>
    <template v-else-if="id === 'sb01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-science party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'sb02'">
      <div class="resource money party-resource">1</div> / 3
      <div class="resource card card-small"></div>
    </template>
    <template v-else-if="id === 'ub01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-venus party-resource-tag"></div>
      <div class="resource-tag tag-earth party-resource-tag"></div>
      <div class="resource-tag tag-jovian party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'ub02'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-space party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'kb01'">
      <div class="resource money party-resource">1</div> /
      <div class="production-box party-production-box">
        <div class="heat production"></div>
      </div>
    </template>
    <template v-else-if="id === 'kb02'">
      <div class="resource heat party-resource"></div> /
      <div class="production-box party-production-box">
        <div class="heat production"></div>
      </div>
    </template>
    <template v-else-if="id === 'rb01'">
      <div class="party-inferior-rating tile party-rating party-tile">&lt;</div> :
      <div class="rating tile party-rating party-tile"></div>
    </template>
    <template v-else-if="id === 'rb02'">
      <div class="party-inferior-rating tile party-rating party-tile">&gt;</div> :
      <div class="rating tile party-rating party-tile red-outline "></div>
    </template>
    <template v-else-if="id === 'gb01'">
      <div class="resource money party-resource">1</div> /
      <div class="resource-tag tag-plant party-resource-tag"></div>
      <div class="resource-tag tag-microbe party-resource-tag"></div>
      <div class="resource-tag tag-animal party-resource-tag"></div>
    </template>
    <template v-else-if="id === 'gb02'">
      <div class="resource money party-resource">2</div> /
      <div class="tile greenery-tile greenery-tile-small"></div>
    </template>
    <template v-else-if="id === 'mfp01'">
      <div class="policy-top-margin"><div class="tile empty-tile-small"></div> : <span class="steel resource"></span></div>
    </template>
    <template v-else-if="id === 'mfp02'">
      <div class="policy-top-margin"><div class="resource-tag tag-building"></div> : <div class="money resource">2</div></div>
    </template>
    <template v-else-if="id === 'mfp03'">
      <div class="policy-top-margin"><div class="resource steel"></div> : +<div class="resource money">1</div></div>
    </template>
    <template v-else-if="id === 'mfp04'">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>
      <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-building"></div></div>
    </template>
    <template v-else-if="id === 'sp01'">
      <span class="money resource">10</span>
      <span class="red-arrow"></span>
      <span class="card card-with-border resource party-resource"></span>
      <span class="card card-with-border resource party-resource"></span>
      <span class="card card-with-border resource party-resource"></span>
    </template>
    <template v-else-if="id === 'sp02'">
      <span>
        <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
        <div class="tile ocean-tile req-tile-small"></div>
        <div class="tile temperature-tile req-tile-small"></div>
        : ± 2
      </span>
    </template>
    <template v-else-if="id === 'sp03'">
      <span>
        <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
        <div class="tile ocean-tile req-tile-small"></div>
        <div class="tile temperature-tile req-tile-small"></div>
        : <div class="resource card card-with-border"></div>
      </span>
    </template>
    <template v-else-if="id === 'sp04'">
      <div class="scientists-requisite"><div class="resource-tag tag-science party-resource-tag"></div></div>
    </template>
    <template v-else-if="id === 'up01'">
      <div class="policy-top-margin"><div class="resource titanium"></div> : + <div class="resource money">1</div></div>
    </template>
    <template v-else-if="id === 'up02'">
      <div class="policy-top-margin">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>2<span class="titanium resource"></span> / 2<span class="floater resource"></span>
      </div>
    </template>
    <template v-else-if="id === 'up03'">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>
      <div class="resource card card-with-border policy-card-with-tag"><div class="card-icon tag-space"></div></div>
    </template>
    <template v-else-if="id === 'up04'"> `<div class="policy-top-margin"><div class="resource-tag tag-space"></div> : <div class="money resource">-2</div></div>
    </template>
    <template v-else-if="id === 'kp01'">
      <span class="money resource">10</span>
      <span class="red-arrow-infinity"></span>
      <div class="production-box production-box-size2">
        <div class="energy production"></div>
        <div class="heat production"></div>
      </div>
    </template>
    <template v-else-if="id === 'kp02'">
      <div class="tile temperature-tile req-tile-small" style="margin-right:5px;"></div> : <span class="money resource">3</span>
    </template>
    <template v-else-if="id === 'kp03'">
      6 <span class="heat resource"></span>
      <span class="red-arrow-infinity"></span>
      <div class="tile temperature-tile"></div>
    </template>
    <template v-else-if="id === 'kp04'">
      <div class="policy-top-margin"><div class="tile empty-tile-small"></div> :
      <span class="heat resource"></span><span class="heat resource"></span></div>
    </template>
    <template v-else-if="id === 'rp01'">
      <div class="policy-top-margin">
      <div class="rating tile"></div> :
      <div class="resource money">-3</div>
      </div>
    </template>
    <template v-else-if="id === 'rp02'">
      <div class="policy-top-margin"><div class="tile empty-tile-small"></div> : <span class="money resource">-3</span></div>
    </template>
    <template v-else-if="id === 'rp03'">
      <span class="money resource">4</span>
      <span class="red-arrow-3x"></span>
      <div class="tile oxygen-tile req-tile-small red-outline" style="margin: 10px -5px;"></div> /
      <div class="tile ocean-tile req-tile-small red-outline"></div> /
      <div class="tile temperature-tile req-tile-small red-outline"></div>
    </template>
    <template v-else-if="id === 'rp04'">
      <div class="tile oxygen-tile req-tile-small" style="margin: 10px -5px;"></div>
      <div class="tile ocean-tile req-tile-small"></div>
      <div class="tile temperature-tile req-tile-small"></div>
      : <div class="production-box production-box-size2" style="margin-left:5px;">
        <div class="production-prefix minus"></div><div class="money production">1</div>
      </div>
    </template>
    <template v-else-if="id === 'gp01'">
      <div class="tile greenery-tile"></div> : <div class="resource money">4</div>
    </template>
    <template v-else-if="id === 'gp02'">
      <div class="policy-top-margin"><div class="tile empty-tile-small"></div> : <span class="plant resource"></span></div>
    </template>
    <template v-else-if="id === 'gp03'">
      <div class="policy-top-margin">
      <div class="resource-tag tag-plant party-resource-tag"></div>
      <div class="resource-tag tag-microbe party-resource-tag"></div>
      <div class="resource-tag tag-animal party-resource-tag"></div> : <div class="resource money">2</div>
      </div>
    </template>
    <template v-else-if="id === 'gp04'">
      <div class="policy-top-margin">
      <span class="money resource">5</span>
      <span class="red-arrow-3x"></span>3<span class="plant resource"></span> / 2<span class="microbe resource"></span>
      </div>
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
    type: {
      type: String as () => 'dominant-bonus' | 'policy-bonus' | 'party-bonus',
    },
    id: {
      type: String as () => string | undefined,
    },
  },
  computed: {
    getClass(): string {
      switch (this.type) {
      case 'dominant-bonus':
        return 'dominant-party-bonus';
      case 'party-bonus':
        return 'party-bonus';
      }
      return '';
    },
  },
});

</script>

