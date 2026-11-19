<template>
  <div class="resource-item" :class="mainCSS">
    <div class="resource-item-stock">
      <span class="resource-icon tooltip tooltip-bottom" :class="iconCSS" :data-tooltip="resourceTypeTooltip"></span>
      <div class="resource-item-stock-count" data-test="stock-count">{{ count }}</div>
    </div>
    <div class="resource-item-prod">
      <span class="resource-item-prod-count tooltip tooltip-bottom" data-test="production" :data-tooltip="productionCountTooltip">{{ productionSign }}{{ production }}</span>
      <div class="shield-parent" data-test="protection-shield"> <!-- Why is this a child of resource-item-prod? -->
        <div v-if="protectionIcon !== ''" :class="protectionIcon"></div>
        <div v-if="showProductionProtectedIcon" class="shield-production-protection"></div>
        <div v-if="showResourceProtectionIcon" class="shield-resource-protection"></div>
      </div>
      <div v-if="showResourceValue" class="resource-icon--megacredit-value" data-test="resource-value">{{ value }}</div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent} from 'vue';
import {DEFAULT_STEEL_VALUE, DEFAULT_TITANIUM_VALUE} from '@/common/constants';
import {Resource} from '@/common/Resource';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {Protection} from '@/common/models/PlayerModel';

export default defineComponent({
  name: 'PlayerResource',
  props: {
    type: {
      type: String as () => Resource,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    production: {
      type: Number,
      required: true,
    },
    resourceProtection: {
      type: String as () => Protection,
      required: false,
      default: 'off',
    },
    productionProtection: {
      type: String as () => Protection,
      default: 'off',
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    showResourceValue(): boolean {
      const learnerModeOn = getPreferences().learner_mode;

      switch (this.type) {
      case Resource.STEEL:
        return learnerModeOn || this.value > DEFAULT_STEEL_VALUE;
      case Resource.TITANIUM:
        return learnerModeOn || this.value > DEFAULT_TITANIUM_VALUE;
      case Resource.HEAT:
        return this.value > 0;
      default:
        return false;
      }
    },
    mainCSS(): string {
      return 'resource-item--' + this.type;
    },
    iconCSS(): string {
      return 'resource-icon--' + this.type;
    },
    productionSign(): string {
      if (this.production > 0) {
        return '+';
      }
      return '';
    },
    protectionIcon(): string {
      if (this.resourceProtection === 'on') {
        return 'shield-icon';
      }
      if (this.resourceProtection === 'half') {
        return 'shield-icon-half';
      }
      if (this.productionProtection === 'on') {
        return 'shield-icon';
      }
      return '';
    },
    showProductionProtectedIcon(): boolean {
      return this.productionProtection === 'on';
    },
    showResourceProtectionIcon(): boolean {
      return this.productionProtection === 'on' && this.resourceProtection !== 'off';
    },
    resourceTypeTooltip(): string {
      if (this.type === Resource.MEGACREDITS) {
        return this.$t('MegaCredits (M€)');
      }
      return this.$t(this.type.charAt(0).toUpperCase() + this.type.slice(1));
    },
    productionCountTooltip(): string {
      return this.$t('Production count');
    },
  },
});
</script>
