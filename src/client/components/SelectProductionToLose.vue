<template>
  <div class="wf-component wf-component--select-production-to-lose">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>

    <h3 v-if="playerinput.warning !== undefined" class="payments_title">{{ $t(playerinput.warning) }}</h3>

    <div class="payments_type input-group" v-for="type in deductibleTypes" :key="type">
      <div class="production-box"><div :class="['production', iconClass(type)]" :style="type === 'megacredits' ? 'background-size:contain;' : ''"></div></div>
      <button class="btn btn-primary" @click="delta(type, -1)"><i class="icon icon-minus" ></i></button>
      <input class="form-input form-inline payments_input" v-model.number="units[type]" >
      <button class="btn btn-primary" @click="delta(type, 1)"><i class="icon icon-plus" ></i></button>
    </div>

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="nofloat">
        <button class="btn btn-primary btn-submit" @click="saveData">{{ $t(playerinput.buttonLabel) }}</button>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';

import {SelectProductionToLoseModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Units} from '@/common/Units';
import {SelectProductionToLoseResponse} from '@/common/inputs/InputResponse';
import {sum} from '@/common/utils/utils';
import {PRODUCTION_MINIMUMS} from '@/common/constants';

const iconClasses: Record<keyof Units, string> = {
  megacredits: 'resource_icon--megacredits',
  steel: 'steel',
  titanium: 'titanium',
  plants: 'plant',
  energy: 'energy',
  heat: 'heat',
};

type DataModel = {
  units: Units,
  warning: string | undefined;
}

export default defineComponent({
  name: 'SelectProductionToLose',
  props: {
    playerView: {
      type: Object as () => PlayerViewModel,
      required: true,
    },
    playerinput: {
      type: Object as () => SelectProductionToLoseModel,
      required: true,
    },
    onsave: {
      type: Function as unknown as () => (out: SelectProductionToLoseResponse) => void,
      required: true,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data(): DataModel {
    return {
      units: {...Units.EMPTY},
      warning: undefined,
    };
  },
  computed: {
    deductibleTypes(): ReadonlyArray<keyof Units> {
      return Units.keys.filter((type) => this.maxLoss(type) > 0);
    },
  },
  methods: {
    iconClass(type: keyof Units): string {
      return iconClasses[type];
    },
    hasWarning() {
      return this.warning !== undefined;
    },
    /** Returns the number of production steps this unit can decrease */
    maxLoss(type: keyof Units): number {
      return this.playerinput.payProduction.units[type] - PRODUCTION_MINIMUMS[type];
    },
    /** Click handler for the - and + buttons */
    delta(type: keyof Units, direction: number) {
      const newValue = this.units[type] + direction;
      this.units[type] = Math.min(Math.max(newValue, 0), this.maxLoss(type));
    },
    saveData() {
      const total = sum(Units.values(this.units));

      if (total !== this.playerinput.payProduction.cost) {
        this.warning = `Pay a total of ${this.playerinput.payProduction.cost} production units`;
        return;
      }

      this.onsave({type: 'productionToLose', units: this.units});
    },
  },
});
</script>
