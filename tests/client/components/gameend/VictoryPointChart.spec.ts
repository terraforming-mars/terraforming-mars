import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import VictoryPointChart from '@/client/components/gameend/VictoryPointChart.vue';

describe('VictoryPointChart', () => {
  // VictoryPointChart uses canvas/Chart.js which JSDOM can't fully handle
  it('mounts without errors', async () => {
    const wrapper = shallowMount(VictoryPointChart, {
      ...globalConfig,
      props: {
        datasets: [],
        generation: 5,
        animation: false,
        id: 'test-chart',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
