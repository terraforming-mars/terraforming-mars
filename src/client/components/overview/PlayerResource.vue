<template>
  <div class="resource_item" :class="mainCSS">
      <div class="resource_item_stock">
          <i class="resource_icon" :class="iconCSS"></i>
          <div class="resource_item_stock_count" data-test="stock-count">{{ count }}</div>
      </div>
      <div class="resource_item_prod">
          <span class="resource_item_prod_count" data-test="production">{{ productionSign }}{{ production }}</span>
          <div class="shield_parent" data-test="protection-shield"> <!-- Why is this a child of resource_item_prod?-->
            <div v-if="protectionIcon !== ''" :class="protectionIcon"></div>
            <div v-if="showProductionProtectedIcon" class="shield_production_protection"></div>
            <div v-if="showResourceProtectionIcon" class="shield_resource_protection"></div>
          </div>
          <div v-if="showResourceValue()" class="resource_icon--megacredit-value" data-test="resource-value">{{ value }}</div>
      </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {DEFAULT_STEEL_VALUE, DEFAULT_TITANIUM_VALUE} from '@/common/constants';
import {Resources} from '@/common/Resources';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {Protection} from '@/common/models/PlayerModel';

export default Vue.extend({
  name: 'PlayerResource',
  props: {
    type: {
      type: String as () => Resources,
    },
    count: {
      type: Number,
    },
    production: {
      type: Number,
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
  data() {
    return {
    };
  },
  methods: {
    showResourceValue(): boolean {
      const learnerModeOn = getPreferences().learner_mode;

      switch (this.type) {
      case Resources.STEEL:
        return learnerModeOn || this.value > DEFAULT_STEEL_VALUE;
      case Resources.TITANIUM:
        return learnerModeOn || this.value > DEFAULT_TITANIUM_VALUE;
      case Resources.HEAT:
        return this.value > 0;
      default:
        return false;
      }
    },
  },
  computed: {
    mainCSS(): string {
      return 'resource_item--' + this.type;
    },
    iconCSS(): string {
      return 'resource_icon--' + this.type;
    },
    productionSign(): string {
      if (this.production > 0) return '+';
      return '';
    },
    protectionIcon(): string {
      if (this.resourceProtection === 'on') {
        return 'shield_icon';
      }
      if (this.resourceProtection === 'half') {
        return 'shield_icon_half';
      }
      if (this.productionProtection === 'on') {
        return 'shield_icon';
      }
      return '';
    },
    showProductionProtectedIcon(): boolean {
      return this.productionProtection === 'on';
    },
    showResourceProtectionIcon(): boolean {
      return this.productionProtection === 'on' && this.resourceProtection !== 'off';
    },
  },
});
</script>
