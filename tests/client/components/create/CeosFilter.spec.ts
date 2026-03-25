import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CeosFilter from '@/client/components/create/CeosFilter.vue';
import ModuleItemFilter from '@/client/components/create/ModuleItemFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {CardName} from '@/common/cards/CardName';

const EXPANSIONS = {...DEFAULT_EXPANSIONS, ceo: true};

describe('CeosFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CeosFilter, {
      ...globalConfig,
      props: {
        expansions: EXPANSIONS,
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders a ModuleItemFilter child', () => {
    const wrapper = shallowMount(CeosFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, ceo: true}, selected: []},
    });
    expect(wrapper.findComponent(ModuleItemFilter).exists()).to.be.true;
  });

  it('passes "CEOs" as the title', () => {
    const wrapper = shallowMount(CeosFilter, {
      ...globalConfig,
      props: {expansions: EXPANSIONS, selected: []},
    });
    expect(wrapper.findComponent(ModuleItemFilter).props('title')).to.eq('CEOs');
  });

  it('uses the provided selection when selected is non-empty', () => {
    const provided: Array<CardName> = [CardName.HELION];
    const wrapper = shallowMount(CeosFilter, {
      ...globalConfig,
      props: {expansions: EXPANSIONS, selected: provided},
    });
    const inner = wrapper.findComponent(ModuleItemFilter);
    expect(inner.props('selected')).to.deep.eq(provided);
  });

  it('auto-selects base Ceos when selected is empty', () => {
    const wrapper = shallowMount(CeosFilter, {
      ...globalConfig,
      props: {expansions: EXPANSIONS, selected: []},
    });
    const inner = wrapper.findComponent(ModuleItemFilter);
    const selected: Array<string> = inner.props('selected');
    expect(selected.length).to.be.greaterThan(0);
    // Beginner Corporation must be excluded
    expect(selected).not.to.include(CardName.BEGINNER_CORPORATION);
  });

  it('emits ceo-list-changed when ModuleItemFilter emits update:selected', async () => {
    const wrapper = shallowMount(CeosFilter, {
      ...globalConfig,
      props: {expansions: EXPANSIONS, selected: []},
    });
    const payload: Array<CardName> = [CardName.HELION];
    await wrapper.findComponent(ModuleItemFilter).vm.$emit('update:selected', payload);
    const emitted = wrapper.emitted('ceo-list-changed');
    expect(emitted).to.have.length(1);
    expect(emitted![0][0]).to.deep.eq(payload);
  });

  it('emits close when ModuleItemFilter emits close', async () => {
    const wrapper = shallowMount(CeosFilter, {
      ...globalConfig,
      props: {expansions: EXPANSIONS, selected: []},
    });
    await wrapper.findComponent(ModuleItemFilter).vm.$emit('close');
    expect(wrapper.emitted('close')).to.have.length(1);
  });
});
