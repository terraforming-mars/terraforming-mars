<template>
  <div style="position:absolute">
  <div v-if="metadata.build.type === ColonyBenefit.ADD_RESOURCES_TO_CARD">
    <template v-if="metadata.build.quantity[idx] === 3">
      <div class="colony-placement-bonus triple-res resource white-x white-x--3" :class="resource"></div>
    </template>
    <template v-else>
      <!-- why margin-top? -->
      <div class="resource" style="margin-top:11px;" :class="resource"></div>
    </template>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.COPY_TRADE">
    <div class="copy-trade-box">Copy Trade</div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.DRAW_CARDS && metadata.build.quantity[idx] === 2">
    <div class="resource card card-with-border" style="margin-top: 0px; margin-left: -5px; transform: scale(0.8);"></div>
    <div class="resource card card-with-border" style="position: absolute; margin: 0 0 0 -30px; transform: scale(0.8);"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.GAIN_INFLUENCE">
    <div class="influence" style="margin-top:5px"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.GAIN_PRODUCTION">
    <div class="production-box"><div class="production" :class="resource">{{buildQuantityText}}</div></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.GAIN_RESOURCES">
    <!-- there's only one right now. This can be generalized, of course. -->
    <div class="colony-placement-bonus resource triple-res titanium white-x white-x--3"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.GAIN_SCIENCE_TAG">
    <div class="tag tag-science" style="transform: scale(0.8); margin-top: 2px; margin-left: 4px"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.GAIN_TR">
    <div class="tile rating" style="transform: scale(0.8); margin-left:-1px"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.GAIN_VP">
    <div class="points points-big" style="transform:scale(0.5); margin-left: -16px; margin-top: -18px; height: 80px; line-height:80px; font-size: 72px">{{buildQuantityText}}</div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.INCREASE_VENUS_SCALE">
    <div class="tile venus-tile venus-colony-bonus"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.OPPONENT_DISCARD">
    <div class="resource card red-outline" style="margin-left: 5px; margin-top: 2px; transform: scale(0.8);"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.PLACE_OCEAN_TILE">
    <div class="tile ocean-tile ocean-tile-colony"></div>
  </div>
  <div v-else-if="metadata.build.type === ColonyBenefit.PLACE_HAZARD_TILE">
    <div class="tile hazard-tile"></div>
  </div>
</div>
</template>
<script lang="ts">

import Vue from 'vue';

import {ColonyMetadata} from '@/common/colonies/ColonyMetadata';
import {ColonyBenefit} from '@/common/colonies/ColonyBenefit';

export default Vue.extend({
  name: 'BuildBenefit',
  props: {
    metadata: {
      type: Object as () => ColonyMetadata,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ColonyBenefit(): typeof ColonyBenefit {
      return ColonyBenefit;
    },
    buildQuantityText(): string {
      return this.metadata.build.quantity[this.idx] > 1 ? String(this.metadata.build.quantity[this.idx]) : '';
    },
    resource(): string | undefined {
      return (this.metadata.build.resource ?? this.metadata.cardResource)?.toLowerCase();
    },
  },
});
</script>
