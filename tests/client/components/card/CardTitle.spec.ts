import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardTitle from '@/client/components/card/CardTitle.vue';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';

describe('CardTitle', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardTitle, {
      ...globalConfig,
      props: {
        title: 'Test Card' as CardName,
        type: CardType.AUTOMATED,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
