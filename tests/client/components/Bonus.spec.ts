import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import Bonus from '@/client/components/Bonus.vue';
import {SpaceBonus} from '@/common/boards/SpaceBonus';

describe('Bonus', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Bonus, {
      ...globalConfig,
      props: {
        bonus: [SpaceBonus.STEEL],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
