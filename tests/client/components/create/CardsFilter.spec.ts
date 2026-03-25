import {shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import CardsFilter from '@/client/components/create/CardsFilter.vue';
import {CardName} from '@/common/cards/CardName';

describe('CardsFilter', () => {
  it('deep watcher detects array mutation', async () => {
    const wrapper = shallowMount(CardsFilter, {...globalConfig, props: {title: 'title', hint: 'hint'}, attachTo: document.body});
    (wrapper.vm as any).addCard(CardName.ACQUIRED_COMPANY);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    (wrapper.vm as any).addCard(CardName.ADAPTED_LICHEN);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('cards-list-changed');
    expect(emitted).to.not.be.undefined;
    expect(emitted!.length).to.be.greaterThanOrEqual(2);
  });

  it('emits', async () => {
    const wrapper = shallowMount(CardsFilter, {...globalConfig, props: {title: 'title', hint: 'hint'}, attachTo: document.body});
    // TODO(kberg): wrapper.vm.addCard exists, but npm run build:tests doesn't think so.
    (wrapper.vm as any).addCard(CardName.ACQUIRED_COMPANY);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('cards-list-changed');
    expect(emitted).to.not.be.undefined;
    const [val] = emitted!;
    expect(val).deep.eq([[CardName.ACQUIRED_COMPANY]]);
  });
});
