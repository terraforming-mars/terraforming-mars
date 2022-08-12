<template>
    <div class="victory-point-chart-container">
    <div></div>
      <canvas id="victory-point-chart"></canvas>
    <div></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {Chart, registerables} from 'chart.js';
import {Color} from '@/common/Color';
import {PublicPlayerModel} from '@/common/models/PlayerModel';

Chart.register(...registerables);
Chart.defaults.font.size = 20;
Chart.defaults.font.family = 'Ubuntu, Sans';
Chart.defaults.color = 'rgb(240, 240, 240)';

const ColorStringMap: Record<Color, string> = {
  [Color.RED]: 'rgb(153, 17, 0)',
  [Color.YELLOW]: 'rgb(170, 170, 0)',
  [Color.GREEN]: 'rgb(0, 153, 0)',
  [Color.BLACK]: 'rgb(170, 170, 170)',
  [Color.BLUE]: 'rgb(0, 102, 255)',
  [Color.PURPLE]: 'rgb(140, 0, 255)',
  [Color.ORANGE]: 'rgb(236, 113, 12)',
  [Color.PINK]: 'rgb(245, 116, 187)',

  // Not actual player colors
  [Color.NEUTRAL]: '',
  [Color.BRONZE]: '',
};

interface ChartDataSet {
  label: string,
  data: Array<number>,
  fill: boolean,
  backgroundColor: string,
  borderColor: string,
  tension: number,
  pointRadius: number,
}

export default Vue.extend({
  name: 'VictoryPointChart',
  data: function() {
    return {};
  },
  props: {
    players: {
      type: Array as () => Array<PublicPlayerModel>,
    },
    generation: {
      type: Number,
    },
    animation: {
      type: Boolean,
    },
  },
  methods: {
    getLabels: function(): Array<number> {
      return Array.from({length: this.generation}, (_, index) => index + 1);
    },
    getOnePlayerDataSet: function(player: PublicPlayerModel): ChartDataSet {
      return {
        label: player.name,
        data: player.victoryPointsByGeneration,
        fill: false,
        backgroundColor: ColorStringMap[player.color],
        borderColor: ColorStringMap[player.color],
        tension: 0.1,
        pointRadius: 6,
      };
    },
    getAllPlayerDataSet: function(): Array<ChartDataSet> {
      return this.players.map((player) => this.getOnePlayerDataSet(player));
    },
    renderChart: function(): void {
      const ctx = document.getElementById('victory-point-chart') as HTMLCanvasElement;
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
                title: {text: 'Victory Points', display: true},
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
                title: {text: 'Generation', display: true},
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
