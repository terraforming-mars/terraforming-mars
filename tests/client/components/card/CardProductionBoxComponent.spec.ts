import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardProductionBoxComponent from '@/client/components/card/CardProductionBoxComponent.vue';

describe('CardProductionBoxComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardProductionBoxComponent, {
      localVue: getLocalVue(),
      propsData: {
        rows: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
