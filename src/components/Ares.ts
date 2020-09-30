import Vue from "vue";

export const Ares = Vue.component("ares", {
    props: ["aresData"],
    data: function() {
        return {

        };
    },
    // U+2705
    template: `
    <div class="ares-container">
      Ares data:
      <p>
      <span v-if="!aresData.hazardData.erosionOceanCount.available">&#x2705; </span>
          {{aresData.hazardData.erosionOceanCount.threshold}} oceans: erosions appear<br/>
      <span v-if="!aresData.hazardData.removeDustStormsOceanCount.available">&#x2705; </span>
          {{aresData.hazardData.removeDustStormsOceanCount.threshold}} oceans: remove dust storms, gain 1TR<br/>
      <span v-if="!aresData.hazardData.severeErosionTemperature.available">&#x2705; </span>
          {{aresData.hazardData.severeErosionTemperature.threshold}}C temp: severe erosions<br/>
      <span v-if="!aresData.hazardData.severeDustStormOxygen.available">&#x2705; </span>
          {{aresData.hazardData.severeDustStormOxygen.threshold}}% oxygen: severe dust storms<br/></p>
    </div>
`
});