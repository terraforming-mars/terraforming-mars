<template>
  <div class="wf-component">
    <div v-if="hazardData.erosionOceanCount.available">
        <span v-i18n>Reveal erosions at:</span>&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="lowOceanDelta" v-model="lowOceanDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option" v-i18n>{{ value + hazardData.erosionOceanCount.threshold }} oceans</div>
        </label>
    </div>

    <div v-if="hazardData.removeDustStormsOceanCount.available">
        <span v-i18n>Remove dust storms at:</span>&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="highOceanDelta" v-model="highOceanDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option" v-i18n>{{ value + hazardData.removeDustStormsOceanCount.threshold }} oceans</div>
        </label>
    </div>

    <div v-if="hazardData.severeErosionTemperature.available">
        <span v-i18n>Amplify erosions at:</span>&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="temperatureDelta" v-model="temperatureDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option" v-i18n>{{ (2 * value) + hazardData.severeErosionTemperature.threshold }} °C</div>
        </label>
    </div>

    <div v-if="hazardData.severeDustStormOxygen.available">
        <span v-i18n>Amplify dust storms at:</span>&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="oxygenDelta" v-model="oxygenDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option" v-i18n>{{ value + hazardData.severeDustStormOxygen.threshold }}% oxygen</div>
        </label>
    </div>

    <div v-if="showsave === true" class="nofloat">
        <button class="btn btn-primary btn-submit" v-on:click="saveData">{{playerinput.buttonLabel}}</button>
    </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {AresGlobalParametersResponse} from '@/common/inputs/AresGlobalParametersResponse';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {InputResponse} from '@/common/inputs/InputResponse';

export default Vue.extend({
  name: 'ShiftAresGlobalParameters',
  props: {
    playerinput: {
      type: Object as () => Required<Pick<PlayerInputModel, 'aresData' | 'buttonLabel'>>,
    },
    onsave: {
      type: Function as unknown as () => (out: InputResponse) => void,
    },
    showsave: {
      type: Boolean,
    },
    showtitle: {
      type: Boolean,
    },
  },
  data() {
    const hazardData = this.playerinput.aresData.hazardData;
    return {
      hazardData: hazardData,
      lowOceanDelta: 0,
      highOceanDelta: 0,
      temperatureDelta: 0,
      oxygenDelta: 0,
      ADJUSTMENT_RANGE: [-1, 0, 1],
    };
  },
  methods: {
    saveData() {
      const response: AresGlobalParametersResponse = {
        lowOceanDelta: this.$data.lowOceanDelta,
        highOceanDelta: this.$data.highOceanDelta,
        temperatureDelta: this.$data.temperatureDelta,
        oxygenDelta: this.$data.oxygenDelta,
      };

      this.onsave([[
        JSON.stringify(response),
      ]]);
    },
  },
});
</script>
