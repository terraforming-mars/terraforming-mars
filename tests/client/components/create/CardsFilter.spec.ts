import {mount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import CardsFilter from '@/client/components/create/CardsFilter.vue';
import {CardName} from '@/common/cards/CardName';

describe('CardsFilter', () => {
  it('deep watcher detects array mutation', async () => {
    const wrapper = mount(CardsFilter, {...globalConfig, props: {title: 'title', hint: 'hint'}, attachTo: document.body});
    wrapper.vm.addCard(CardName.ACQUIRED_COMPANY);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    wrapper.vm.addCard(CardName.ADAPTED_LICHEN);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('cards-list-changed');
    expect(emitted).to.not.be.undefined;
    expect(emitted!.length).to.be.greaterThanOrEqual(2);
  });

  it('emits', async () => {
    const wrapper = mount(CardsFilter, {...globalConfig, props: {title: 'title', hint: 'hint'}, attachTo: document.body});
    wrapper.vm.addCard(CardName.ACQUIRED_COMPANY);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('cards-list-changed');
    expect(emitted).to.not.be.undefined;
    const [val] = emitted!;
    expect(val).deep.eq([[CardName.ACQUIRED_COMPANY]]);
  });

  it('starts with the selected cards', () => {
    const wrapper = mount(CardsFilter, {
      ...globalConfig,
      props: {title: 'title', hint: 'hint', selected: [CardName.ADAPTED_LICHEN, CardName.ACQUIRED_COMPANY]},
      attachTo: document.body,
    });
    const results = wrapper.findAll('.cards-filter-result').map((result) => result.text());
    expect(results).deep.eq([CardName.ADAPTED_LICHEN, CardName.ACQUIRED_COMPANY]);
  });

  it('emits close', async () => {
    const wrapper = mount(CardsFilter, {...globalConfig, props: {title: 'title', hint: 'hint'}, attachTo: document.body});
    await wrapper.find('.close-button').trigger('click');
    expect(wrapper.emitted('close')).to.have.length(1);
  });

  it('leaves selected cards out of the suggestions', async () => {
    const wrapper = mount(CardsFilter, {
      ...globalConfig,
      props: {title: 'title', hint: 'hint', selected: [CardName.ADAPTED_LICHEN]},
      attachTo: document.body,
    });
    await wrapper.find('input').setValue('lichen');
    expect(wrapper.vm.searchMatches).does.not.include(CardName.ADAPTED_LICHEN);
    expect(wrapper.vm.searchMatches).includes(CardName.LICHEN);

    wrapper.vm.removeCard(CardName.ADAPTED_LICHEN);
    expect(wrapper.vm.searchMatches).includes(CardName.ADAPTED_LICHEN);
  });

  it('arrow keys and enter add a suggestion', async () => {
    const wrapper = mount(CardsFilter, {...globalConfig, props: {title: 'title', hint: 'hint'}, attachTo: document.body});
    const input = wrapper.find('input');
    await input.setValue('mars');
    expect(wrapper.vm.searchMatches.length).to.be.greaterThan(2);
    const second = wrapper.vm.searchMatches[1];

    // Up at the top stays on the first entry.
    await input.trigger('keydown', {key: 'ArrowUp'});
    await input.trigger('keydown', {key: 'ArrowDown'});
    await input.trigger('keydown', {key: 'ArrowDown'});
    await input.trigger('keydown', {key: 'ArrowUp'});
    expect(wrapper.find('.cards-filter-suggest-item-highlighted').text()).eq(second);

    await input.trigger('keydown', {key: 'Enter'});
    expect(wrapper.vm.selectedCards).deep.eq([second]);
  });
});
