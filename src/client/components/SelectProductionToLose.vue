<template>
  <!-- TODO(chosta): consolidate repetition into a reusable component. -->
  <div class="wf-component wf-component--select-production-to-lose">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>

    <h3 class="payments_title" v-i18n>Which resource production would you prefer to decrease?</h3>

    <div class="payments_type input-group" v-if="canDeductMegaCredits()">
      <div class="production-box"><div class="production resource_icon--megacredits" style="background-size:contain;"></div></div>
      <button class="btn btn-primary" v-on:click="delta('megacredits', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="units.megacredits" />
      <button class="btn btn-primary" v-on:click="delta('megacredits', 1)"><i class="icon icon-plus" /></button>
    </div>
    <div class="payments_type input-group" v-if="canDeductSteel()">
      <div class="production-box"><div class="production steel"></div></div>
      <button class="btn btn-primary" v-on:click="delta('steel', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="units.steel" />
      <button class="btn btn-primary" v-on:click="delta('steel', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductTitanium()" >
      <div class="production-box"><div class="production titanium"></div></div>
      <button class="btn btn-primary" v-on:click="delta('titanium', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="units.titanium" />
      <button class="btn btn-primary" v-on:click="delta('titanium', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductPlants()" >
      <div class="production-box"><div class="production plant"></div></div>
      <button class="btn btn-primary" v-on:click="delta('plants', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="units.plants" />
      <button class="btn btn-primary" v-on:click="delta('plants', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductEnergy()" >
      <div class="production-box"><div class="production energy"></div></div>
      <button class="btn btn-primary" v-on:click="delta('energy', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="units.energy" />
      <button class="btn btn-primary" v-on:click="delta('energy', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductHeat()" >
      <div class="production-box"><div class="production heat"></div></div>
      <button class="btn btn-primary" v-on:click="delta('heat', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="units.heat" />
      <button class="btn btn-primary" v-on:click="delta('heat', 1)"><i class="icon icon-plus" /></button>
    </div >

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="nofloat">
        <button class="btn btn-primary btn-submit" v-on:click="saveData">{{ $t(playerinput.buttonLabel) }}</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {SelectProductionToLoseModel} from '@/common/models/PlayerInputModel';
import {PayProductionModel} from '@/common/models/PayProductionUnitsModel';
import {Units} from '@/common/Units';
import {SelectProductionToLoseResponse} from '@/common/inputs/InputResponse';
import {sum} from '@/common/utils/utils';

const props = defineProps<{
  playerinput: SelectProductionToLoseModel;
  onsave: (out: SelectProductionToLoseResponse) => void;
  showsave?: boolean;
  showtitle?: boolean;
}>();

const units = ref<Units>({...Units.EMPTY});
const warning = ref<string | undefined>(undefined);

function canDeductMegaCredits() {
  return props.playerinput.payProduction.units.megacredits > -5;
}

function canDeductSteel() {
  return props.playerinput.payProduction.units.steel > 0;
}

function canDeductTitanium() {
  return props.playerinput.payProduction.units.titanium > 0;
}

function canDeductPlants() {
  return props.playerinput.payProduction.units.plants > 0;
}

function canDeductEnergy() {
  return props.playerinput.payProduction.units.energy > 0;
}

function canDeductHeat() {
  return props.playerinput.payProduction.units.heat > 0;
}

function hasWarning() {
  return warning.value !== undefined;
}

function delta(type: keyof Units, direction: number) {
  const expendableProductionQuantity = function(type: keyof Units, model: PayProductionModel): number {
    switch (type) {
    case 'megacredits':
      return model.units.megacredits + 5;
    case 'steel':
      return model.units.steel;
    case 'titanium':
      return model.units.titanium;
    case 'plants':
      return model.units.plants;
    case 'energy':
      return model.units.energy;
    case 'heat':
      return model.units.heat;
    default:
      return -1;
    }
  };
  const current = units.value[type];
  let newValue = current + direction;
  const expendableQuantity = expendableProductionQuantity(type, props.playerinput.payProduction);
  newValue = Math.min(Math.max(newValue, 0), expendableQuantity);
  units.value[type] = newValue;
}

function saveData() {
  const total = sum(Units.values(units.value));

  if (total !== props.playerinput.payProduction.cost) {
    warning.value = `Pay a total of ${props.playerinput.payProduction.cost} production units`;
    return;
  }

  props.onsave({type: 'productionToLose', units: units.value});
}
</script>
