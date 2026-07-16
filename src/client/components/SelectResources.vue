<template>
  <div class="wf-component wf-options">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
    <template v-for="unit in keys">
        <payment-unit-component
          v-model.number="units[unit]"
          v-bind:key="unit"
          :unit="unit"
          :showMax="false"
          description=""
          @plus="addValue(unit)"
          @minus="reduceValue(unit)">
        </payment-unit-component>
        <!-- @max="onMaxClicked(unit)" -->
    </template>
    <div v-if="showsave === true" class="nofloat">
        <AppButton @click="saveData" :title="playerinput.buttonLabel" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectResourcesModel} from '@/common/models/PlayerInputModel';
import {SelectResourcesResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Units} from '@/common/Units';
import PaymentUnitComponent from '@/client/components/PaymentUnit.vue';
import {sum} from '@/common/utils/utils';

export default Vue.extend({
  name: 'SelectResource',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
    },
    playerinput: {
      type: Object as () => SelectResourcesModel,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectResourcesResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data() {
    return {
      units: {...Units.EMPTY},
    };
  },
  components: {
    AppButton,
    PaymentUnitComponent,
  },
  methods: {
    saveData() {
      this.onsave({type: 'resources', units: this.units});
    },
    /**
     * Reduce `unit` by one.
     */
    reduceValue(unit: keyof Units): void {
      const currentValue = this.units[unit];
      if (currentValue === undefined) {
        throw new Error(`can not reduceValue for ${unit} on this`);
      }

      const adjustedDelta = Math.min(1, currentValue);
      if (adjustedDelta === 0) return;
      this.units[unit] -= adjustedDelta;
    },
    /**
     * Increase `unit` by one.
     */
    addValue(unit: keyof Units): void {
      const currentValue = this.units[unit];
      if (currentValue === undefined) {
        throw new Error(`can not addValue for ${unit} on this`);
      }

      if (sum(Units.values(this.units)) >= this.playerinput.count) {
        return;
      }

      this.units[unit] += 1;
    },
  },
  computed: {
    keys(): typeof Units.keys {
      return Units.keys;
    },
  },
});
</script>
