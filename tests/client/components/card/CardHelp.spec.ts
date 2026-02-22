import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardHelp from '@/client/components/card/CardHelp.vue';
import {CardName} from '@/common/cards/CardName';

describe('CardHelp', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardHelp, {
      localVue: getLocalVue(),
      propsData: {
        name: CardName.ECOLINE,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
