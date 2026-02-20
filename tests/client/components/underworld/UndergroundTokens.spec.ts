import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import UndergroundTokens from '@/client/components/underworld/UndergroundTokens.vue';

describe('UndergroundTokens', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(UndergroundTokens, {
      localVue: getLocalVue(),
      propsData: {
        underworldData: {corruption: 0, excavations: [], tokens: []},
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
