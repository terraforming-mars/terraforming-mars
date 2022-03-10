<template>
  <div class="wf-component">
    <div v-if="hazardData.erosionOceanCount.available">
        Reveal erosions at:&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="lowOceanDelta" v-model="lowOceanDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option">{{ value + hazardData.erosionOceanCount.threshold }} oceans.</div>
        </label>
    </div>

    <div v-if="hazardData.removeDustStormsOceanCount.available">
        Remove dust storms at:&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="highOceanDelta" v-model="highOceanDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option">{{ value + hazardData.removeDustStormsOceanCount.threshold }} oceans</div>
        </label>
    </div>

    <div v-if="hazardData.severeErosionTemperature.available">
        Amplify erosions at:&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="temperatureDelta" v-model="temperatureDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option">{{ (2 * value) + hazardData.severeErosionTemperature.threshold }} °C</div>
        </label>
    </div>

    <div v-if="hazardData.severeDustStormOxygen.available">
        Amplify dust storms at:&nbsp;
        <label class="form-radio form-inline ares-global-parameter-label" v-for="value in ADJUSTMENT_RANGE" :key='value'>
          <input type="radio" :value="value" name="oxygenDelta" v-model="oxygenDelta">
          <i class="form-icon" />
          <div class="ares-global-parameter-option">{{ value + hazardData.severeDustStormOxygen.threshold }}% oxygen</div>
        </label>
    </div>

    <div v-if="showsave === true" class="nofloat">
        <button class="btn btn-primary btn-submit" v-on:click="saveData">{{playerinput.buttonLabel}}</button>
    </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
import {IAresGlobalParametersResponse} from '@/common/inputs/IAresGlobalParametersResponse';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';

export default Vue.extend({
  name: 'ShiftAresGlobalParameters',
  props: {
    playerinput: {
      type: Object as () => Required<Pick<PlayerInputModel, 'aresData' | 'buttonLabel'>>,
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
      const response: IAresGlobalParametersResponse = {
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
