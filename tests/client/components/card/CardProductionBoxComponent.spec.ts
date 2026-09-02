import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardProductionBoxComponent from '@/client/components/card/CardProductionBoxComponent.vue';

describe('CardProductionBoxComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardProductionBoxComponent, {
      ...globalConfig,
      props: {
        rows: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
