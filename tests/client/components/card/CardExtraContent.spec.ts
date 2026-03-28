import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardExtraContent from '@/client/components/card/CardExtraContent.vue';
import {CardName} from '@/common/cards/CardName';

describe('CardExtraContent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardExtraContent, {
      ...globalConfig,
      props: {
        card: {
          name: CardName.ECOLINE,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
