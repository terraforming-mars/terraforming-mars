import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import Bonus from '@/client/components/Bonus.vue';
import {SpaceBonus} from '@/common/boards/SpaceBonus';

describe('Bonus', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Bonus, {
      localVue: getLocalVue(),
      propsData: {
        bonus: [SpaceBonus.STEEL],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
