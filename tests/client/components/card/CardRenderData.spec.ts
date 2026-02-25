import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRenderData from '@/client/components/card/CardRenderData.vue';

describe('CardRenderData', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderData, {
      ...globalConfig,
      props: {
        renderData: {
          is: 'root',
          rows: [],
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
