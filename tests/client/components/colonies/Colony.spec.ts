import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import Colony from '@/client/components/colonies/Colony.vue';
import {ColonyName} from '@/common/colonies/ColonyName';

describe('Colony', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Colony, {
      localVue: getLocalVue(),
      propsData: {
        colony: {
          colonies: [],
          isActive: false,
          name: ColonyName.GANYMEDE,
          trackPosition: 1,
          visitor: undefined,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
