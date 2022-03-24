  // TODO(chosta): consolidate repetition into a reusable component.
<template>
  <div class="wf-component wf-component--select-production-to-lose">
    <div v-if="showtitle === true" class="nofloat wf-component-title">{{ $t(playerinput.title) }}</div>

    <h3 class="payments_title" v-i18n>Which resource production would you prefer to decrease?</h3>

    <div class="payments_type input-group" v-if="canDeductMegaCredits()">
      <div class="production-box"><div class="production resource_icon--megacredits" style="background-size:contain;"></div></div>
      <button class="btn btn-primary" v-on:click="delta('megacredits', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="megacredits" />
      <button class="btn btn-primary" v-on:click="delta('megacredits', 1)"><i class="icon icon-plus" /></button>
    </div>
    <div class="payments_type input-group" v-if="canDeductSteel()">
      <div class="production-box"><div class="production steel"></div></div>
      <button class="btn btn-primary" v-on:click="delta('steel', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="steel" />
      <button class="btn btn-primary" v-on:click="delta('steel', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductTitanium()" >
      <div class="production-box"><div class="production titanium"></div></div>
      <button class="btn btn-primary" v-on:click="delta('titanium', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="titanium" />
      <button class="btn btn-primary" v-on:click="delta('titanium', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductPlants()" >
      <div class="production-box"><div class="production plant"></div></div>
      <button class="btn btn-primary" v-on:click="delta('plants', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="plants" />
      <button class="btn btn-primary" v-on:click="delta('plants', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductEnergy()" >
      <div class="production-box"><div class="production energy"></div></div>
      <button class="btn btn-primary" v-on:click="delta('energy', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="energy" />
      <button class="btn btn-primary" v-on:click="delta('energy', 1)"><i class="icon icon-plus" /></button>
    </div >
    <div class="payments_type input-group" v-if="canDeductHeat()" >
      <div class="production-box"><div class="production heat"></div></div>
      <button class="btn btn-primary" v-on:click="delta('heat', -1)"><i class="icon icon-minus" /></button>
      <input class="form-input form-inline payments_input" v-model.number="heat" />
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
<script lang="ts">
import Vue from 'vue';

import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {IPayProductionModel} from '@/common/models/IPayProductionUnitsModel';
import {Units} from '@/common/Units';

interface SelectProductionToLoseModel {
    megacredits: number;
    steel: number;
    titanium: number;
    plants: number;
    energy: number;
    heat: number;
    warning: string | undefined;
}

export default Vue.extend({
  name: 'SelectProductionToLose',
  props: {
    playerinput: {
      type: Object as () => Required<Pick<PlayerInputModel, 'title' | 'payProduction' | 'buttonLabel'>>,
    },
    onsave: {
      type: Function as unknown as () => (out: Array<Array<string>>) => void,
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
      megacredits: 0,
      steel: 0,
      titanium: 0,
      plants: 0,
      energy: 0,
      heat: 0,
      warning: undefined,
    } as SelectProductionToLoseModel;
  },
  methods: {
    canDeductMegaCredits() {
      return this.playerinput.payProduction.units.megacredits > -5;
    },
    canDeductSteel() {
      return this.playerinput.payProduction.units.steel > 0;
    },
    canDeductTitanium() {
      return this.playerinput.payProduction.units.titanium > 0;
    },
    canDeductPlants() {
      return this.playerinput.payProduction.units.plants > 0;
    },
    canDeductEnergy() {
      return this.playerinput.payProduction.units.energy > 0;
    },
    canDeductHeat() {
      return this.playerinput.payProduction.units.heat > 0;
    },
    hasWarning() {
      return this.$data.warning !== undefined;
    },
    delta(type: string, direction: number) {
      const expendableProductionQuantity = function(type: string, model: IPayProductionModel): number {
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
        }
        return -1;
      };
      const current = this.$data[type];
      let newValue = current + direction;
      const lowestValue = (type === 'megacredit') ? -5 : 0;
      const expendableQuantity = expendableProductionQuantity(type, this.playerinput.payProduction as IPayProductionModel);
      newValue = Math.min(Math.max(newValue, lowestValue), expendableQuantity);
      this.$data[type] = newValue;
    },
    saveData() {
      const htp: Units = {
        megacredits: this.$data.megacredits,
        steel: this.$data.steel,
        titanium: this.$data.titanium,
        plants: this.$data.plants,
        energy: this.$data.energy,
        heat: this.$data.heat,
      };

      const sum = this.$data.megacredits +
                this.$data.steel +
                this.$data.titanium +
                this.$data.plants +
                this.$data.energy +
                this.$data.heat;

      if (sum !== this.playerinput.payProduction.cost) {
        this.$data.warning = `Pay a total of ${this.playerinput.payProduction.cost} production units`;
        return;
      }

      this.onsave([[
        JSON.stringify(htp),
      ]]);
    },
  },
});
</script>
