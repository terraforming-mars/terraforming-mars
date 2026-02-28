import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PreludesFilter from '@/client/components/create/PreludesFilter.vue';
import ModuleItemFilter from '@/client/components/create/ModuleItemFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {CardName} from '@/common/cards/CardName';

describe('PreludesFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {
        expansions: {...DEFAULT_EXPANSIONS, prelude: true},
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders a ModuleItemFilter child', () => {
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, prelude: true}, selected: []},
    });
    expect(wrapper.findComponent(ModuleItemFilter).exists()).to.be.true;
  });

  it('passes "Preludes" as the title', () => {
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, prelude: true}, selected: []},
    });
    expect(wrapper.findComponent(ModuleItemFilter).props('title')).to.eq('Preludes');
  });

  it('uses the provided selection when selected is non-empty', () => {
    const provided: Array<CardName> = [CardName.ALLIED_BANK];
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, prelude: true}, selected: provided},
    });
    expect(wrapper.findComponent(ModuleItemFilter).props('selected')).to.deep.eq(provided);
  });

  it('auto-selects prelude cards when selected is empty and prelude is enabled', () => {
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, prelude: true}, selected: []},
    });
    const selected: Array<string> = wrapper.findComponent(ModuleItemFilter).props('selected');
    expect(selected.length).to.be.greaterThan(0);
  });

  it('emits prelude-list-changed when ModuleItemFilter emits update:selected', async () => {
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, prelude: true}, selected: []},
    });
    const payload: Array<CardName> = [CardName.ALLIED_BANK];
    await wrapper.findComponent(ModuleItemFilter).vm.$emit('update:selected', payload);
    const emitted = wrapper.emitted('prelude-list-changed');
    expect(emitted).to.have.length(1);
    expect(emitted![0][0]).to.deep.eq(payload);
  });

  it('emits close when ModuleItemFilter emits close', async () => {
    const wrapper = shallowMount(PreludesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, prelude: true}, selected: []},
    });
    await wrapper.findComponent(ModuleItemFilter).vm.$emit('close');
    expect(wrapper.emitted('close')).to.have.length(1);
  });
});
