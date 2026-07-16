import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import CardsFilter from '@/client/components/create/CardsFilter.vue';
import {CardName} from '@/common/cards/CardName';

describe('CardsFilter', () => {
  it('emits', async () => {
    const wrapper = shallowMount(CardsFilter, {localVue: getLocalVue(), propsData: {title: 'title', hint: 'hint'}});
    // TODO(kberg): wrapper.vm.addCard exists, but npm run build:tests doesn't think so.
    (wrapper.vm as any).addCard(CardName.ACQUIRED_COMPANY);

    expect(wrapper.emitted('cards-list-changed')).to.be.undefined;

    await wrapper.vm.$nextTick();

    const [val] = wrapper.emitted('cards-list-changed')!;
    expect(val).deep.eq([[CardName.ACQUIRED_COMPANY]]);
  });
});
