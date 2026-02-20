import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardRenderData from '@/client/components/card/CardRenderData.vue';

describe('CardRenderData', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderData, {
      localVue: getLocalVue(),
      propsData: {
        renderData: {
          is: 'root',
          rows: [],
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
