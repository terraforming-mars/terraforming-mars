import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardExpansion from '@/client/components/card/CardExpansion.vue';

describe('CardExpansion', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardExpansion, {
      localVue: getLocalVue(),
      propsData: {
        expansion: 'base',
        isCorporation: false,
        isResourceCard: false,
        compatibility: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
