import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import VictoryPointChart from '@/client/components/gameend/VictoryPointChart.vue';

describe('VictoryPointChart', () => {
  // VictoryPointChart uses canvas/Chart.js which JSDOM can't fully handle
  it.skip('mounts without errors', () => {
    const wrapper = shallowMount(VictoryPointChart, {
      localVue: getLocalVue(),
      propsData: {
        datasets: [],
        generation: 5,
        animation: false,
        id: 'test-chart',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
