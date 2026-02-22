import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardExtraContent from '@/client/components/card/CardExtraContent.vue';
import {CardName} from '@/common/cards/CardName';

describe('CardExtraContent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardExtraContent, {
      localVue: getLocalVue(),
      propsData: {
        card: {
          name: CardName.ECOLINE,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
