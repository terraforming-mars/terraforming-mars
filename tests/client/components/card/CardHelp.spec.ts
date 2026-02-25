import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardHelp from '@/client/components/card/CardHelp.vue';
import {CardName} from '@/common/cards/CardName';

describe('CardHelp', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardHelp, {
      ...globalConfig,
      props: {
        name: CardName.ECOLINE,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
