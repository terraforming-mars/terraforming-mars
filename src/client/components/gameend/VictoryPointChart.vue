<template>
    <div class="victory-point-chart-container">
    <!-- <div></div> -->
      <canvas :id="id"></canvas>
    <!-- <div></div> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Chart, registerables} from 'chart.js';
import {Color} from '@/common/Color';
import {translateText} from '@/client/directives/i18n';

Chart.register(...registerables);
Chart.defaults.font.size = 20;
Chart.defaults.font.family = 'Ubuntu, Sans';
Chart.defaults.color = 'rgb(240, 240, 240)';

const COLOR_CODES: Record<Color, string> = {
  ['red']: 'rgb(153, 17, 0)',
  ['yellow']: 'rgb(170, 170, 0)',
  ['green']: 'rgb(0, 153, 0)',
  ['black']: 'rgb(170, 170, 170)',
  ['blue']: 'rgb(0, 102, 255)',
  ['purple']: 'rgb(140, 0, 255)',
  ['orange']: 'rgb(236, 113, 12)',
  ['pink']: 'rgb(245, 116, 187)',

  // Not actual player colors
  ['neutral']: '',
  ['bronze']: '',
};

interface ChartDataSet {
  label: string,
  data: ReadonlyArray<number>,
  fill: boolean,
  backgroundColor: string,
  borderColor: string,
  tension: number,
  pointRadius: number,
}

export type DataSet = {
  label: string;
  data: ReadonlyArray<number>,
  color: Color,
};

export default Vue.extend({
  name: 'VictoryPointChart',
  data: function() {
    return {};
  },
  props: {
    datasets: {
      type: Array as () => Array<DataSet>,
    },
    generation: {
      type: Number,
    },
    animation: {
      type: Boolean,
    },
    id: {
      type: String,
    },
    yAxisLabel: {
      type: String,
      required: false,
      default: 'Victory Points',
    },
  },
  methods: {
    getLabels: function(): Array<number> {
      return Array.from({length: this.generation}, (_, index) => index + 1);
    },
    getAllPlayerDataSet: function(): Array<ChartDataSet> {
      return this.datasets.map((dataset) => {
        return {
          label: dataset.label,
          data: dataset.data,
          fill: false,
          backgroundColor: COLOR_CODES[dataset.color],
          borderColor: COLOR_CODES[dataset.color],
          tension: 0.1,
          pointRadius: 6,
        };
      });
    },
    renderChart: function(): void {
      const ctx = document.getElementById(this.id) as HTMLCanvasElement;
      if (ctx !== null) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.getLabels(),
            datasets: this.getAllPlayerDataSet(),
          },
          options: {
            animation: {
              duration: this.animation ? 1000 : 0,
              easing: 'linear',
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                title: {text: translateText(this.yAxisLabel), display: true},
                grid: {
                  color: (ctx) => {
                    return ctx.tick.value % 10 === 0 ? 'lightgray' : 'rgb(90, 90, 90)';
                  },
                },
                beginAtZero: true,
                ticks: {
                  autoSkip: false,
                  stepSize: 5,
                  callback: (value: string | number) => {
                    // I don't know what to do when it's of string type yet, so this just ensures it's displayed.
                    if (typeof(value) === 'string') return value;
                    return value % 10 === 0 ? value : '';
                  },
                },
              },
              x: {
                title: {text: translateText('Generation'), display: true},
                offset: true,
              },
            },
          },
        });
      }
    },
  },
  mounted() {
    this.renderChart();
  },
});
</script>
