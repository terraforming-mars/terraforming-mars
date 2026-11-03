import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import Card from '@/client/components/card/Card.vue';
import {CardName} from '@/common/cards/CardName';
import {useFakeLocalStorage} from '../FakeLocalStorage';

describe('Card', () => {
  useFakeLocalStorage();

  it('mounts without errors', () => {
    const wrapper = shallowMount(Card, {
      ...globalConfig,
      props: {
        card: {name: CardName.ECOLINE},
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('updates when the card changes', async () => {
    const wrapper = shallowMount(Card, {
      ...globalConfig,
      props: {
        card: {name: CardName.ECOLINE},
      },
    });
    await wrapper.setProps({card: {name: CardName.ANTS}});
    expect(wrapper.vm.cardInstance.name).to.eq(CardName.ANTS);
  });
});
