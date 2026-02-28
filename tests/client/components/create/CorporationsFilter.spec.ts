import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CorporationsFilter from '@/client/components/create/CorporationsFilter.vue';
import ModuleItemFilter from '@/client/components/create/ModuleItemFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {CardName} from '@/common/cards/CardName';

describe('CorporationsFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CorporationsFilter, {
      ...globalConfig,
      props: {
        expansions: {...DEFAULT_EXPANSIONS},
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders a ModuleItemFilter child', () => {
    const wrapper = shallowMount(CorporationsFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS}, selected: []},
    });
    expect(wrapper.findComponent(ModuleItemFilter).exists()).to.be.true;
  });

  it('passes "Corporations" as the title', () => {
    const wrapper = shallowMount(CorporationsFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS}, selected: []},
    });
    expect(wrapper.findComponent(ModuleItemFilter).props('title')).to.eq('Corporations');
  });

  it('uses the provided selection when selected is non-empty', () => {
    const provided: Array<CardName> = [CardName.HELION];
    const wrapper = shallowMount(CorporationsFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS}, selected: provided},
    });
    const inner = wrapper.findComponent(ModuleItemFilter);
    expect(inner.props('selected')).to.deep.eq(provided);
  });

  it('auto-selects base corporations when selected is empty', () => {
    const wrapper = shallowMount(CorporationsFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS}, selected: []},
    });
    const inner = wrapper.findComponent(ModuleItemFilter);
    const selected: Array<string> = inner.props('selected');
    expect(selected.length).to.be.greaterThan(0);
    // Beginner Corporation must be excluded
    expect(selected).not.to.include(CardName.BEGINNER_CORPORATION);
  });

  it('emits corporation-list-changed when ModuleItemFilter emits update:selected', async () => {
    const wrapper = shallowMount(CorporationsFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS}, selected: []},
    });
    const payload: Array<CardName> = [CardName.HELION];
    await wrapper.findComponent(ModuleItemFilter).vm.$emit('update:selected', payload);
    const emitted = wrapper.emitted('corporation-list-changed');
    expect(emitted).to.have.length(1);
    expect(emitted![0][0]).to.deep.eq(payload);
  });

  it('emits close when ModuleItemFilter emits close', async () => {
    const wrapper = shallowMount(CorporationsFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS}, selected: []},
    });
    await wrapper.findComponent(ModuleItemFilter).vm.$emit('close');
    expect(wrapper.emitted('close')).to.have.length(1);
  });
});
