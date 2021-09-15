  // TODO(kberg): merge with dry deserts.
<template>
  <div class="wf-component wf-component--select-production-to-lose">
    <h3 class="payments_title" v-i18n>You may gain up to {{playerinput.amount}} distinct resources.</h3>

    <div class="payments_type input-group">
      <div class="production resource_icon--megacredits" style="background-size:contain;"></div>
      <select-number :min="0" :max="1" v-model="megacredits"/>
    </div>
    <div class="payments_type input-group">
      <div class="production steel"></div>
      <select-number :min="0" :max="1" v-model="steel"/>
    </div >
    <div class="payments_type input-group">
      <div class="production titanium"></div>
      <select-number :min="0" :max="1" v-model="titanium"/>
    </div >
    <div class="payments_type input-group">
      <div class="production plant"></div>
      <select-number :min="0" :max="1" v-model="plants"/>
    </div >
    <div class="payments_type input-group">
      <div class="production energy"></div>
      <select-number :min="0" :max="1" v-model="energy"/>
    </div >
    <div class="payments_type input-group">
      <div class="production heat"></div>
      <select-number :min="0" :max="1" v-model="heat"/>
    </div >

    <div v-if="hasWarning()" class="tm-warning">
      <label class="label label-error">{{ $t(warning) }}</label>
    </div>

    <div v-if="showsave === true" class="nofloat">
        <button class="btn btn-primary btn-submit" v-on:click="saveData" data-test="save" v-i18n>Save</button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import {PlayerInputModel} from '@/models/PlayerInputModel';
import {Units} from '@/Units';
import {TranslateMixin} from '@/components/TranslateMixin';
import SelectNumber from './SelectNumber.vue';

export default Vue.extend({
  name: 'SelectDistinctResources',
  props: {
    playerinput: {
      type: Object as () => Required<Pick<PlayerInputModel, 'title' | 'amount'>>,
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
  components: {
    SelectNumber,
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
    };
  },
  methods: {
    ...TranslateMixin.methods,
    hasWarning() {
      return this.$data.warning !== undefined;
    },
    saveData() {
      const units: Units = {
        megacredits: this.$data.megacredits,
        steel: this.$data.steel,
        titanium: this.$data.titanium,
        plants: this.$data.plants,
        energy: this.$data.energy,
        heat: this.$data.heat,
      };

      const elems = [units.megacredits, units.steel, units.titanium, units.plants, units.energy, units.heat];
      if (elems.some((n) => n < 0 || n > 1)) {
        this.$data.warning = 'Each resource must be distinct';
        return;
      }
      if (elems.reduce((previous, current) => previous + current, 0) > (this.playerinput.amount ?? 0)) {
        this.$data.warning = `Gain no more than ${this.playerinput.amount} distinct resources`;
        return;
      }

      this.onsave([[
        JSON.stringify(units),
      ]]);
    },
  },
});
</script>

