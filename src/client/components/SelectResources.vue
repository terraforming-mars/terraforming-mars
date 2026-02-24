<template>
  <div class="wf-component wf-options">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>
    <template v-for="unit in keys" :key="unit">
        <payment-unit-component
          v-model.number="units[unit]"
          :unit="(unit as SpendableResource)"
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
<script setup lang="ts">
import {ref, computed} from 'vue';
import AppButton from '@/client/components/common/AppButton.vue';
import {SelectResourcesModel} from '@/common/models/PlayerInputModel';
import {SelectResourcesResponse} from '@/common/inputs/InputResponse';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Units} from '@/common/Units';
import {SpendableResource} from '@/common/inputs/Spendable';
import PaymentUnitComponent from '@/client/components/PaymentUnit.vue';
import {sum} from '@/common/utils/utils';

const props = defineProps<{
  playerView: PlayerViewModel;
  playerinput: SelectResourcesModel;
  onsave: (out: SelectResourcesResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const units = ref<Units>({...Units.EMPTY});

const keys = computed((): typeof Units.keys => {
  return Units.keys;
});

function saveData() {
  props.onsave({type: 'resources', units: units.value});
}

/**
 * Reduce `unit` by one.
 */
function reduceValue(unit: keyof Units): void {
  const currentValue = units.value[unit];
  if (currentValue === undefined) {
    throw new Error(`can not reduceValue for ${unit} on this`);
  }

  const adjustedDelta = Math.min(1, currentValue);
  if (adjustedDelta === 0) return;
  units.value[unit] -= adjustedDelta;
}

/**
 * Increase `unit` by one.
 */
function addValue(unit: keyof Units): void {
  const currentValue = units.value[unit];
  if (currentValue === undefined) {
    throw new Error(`can not addValue for ${unit} on this`);
  }

  if (sum(Units.values(units.value)) >= props.playerinput.count) {
    return;
  }

  units.value[unit] += 1;
}
</script>
