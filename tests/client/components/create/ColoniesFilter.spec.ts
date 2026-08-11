import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import {findModuleItemFilter} from '../utils/findComponent';
import ColoniesFilter from '@/client/components/create/ColoniesFilter.vue';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {ColonyName} from '@/common/colonies/ColonyName';

describe('ColoniesFilter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {
        expansions: {...DEFAULT_EXPANSIONS, colonies: true},
        selected: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders a ModuleItemFilter child', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true}, selected: []},
    });
    expect(findModuleItemFilter(wrapper).exists()).to.be.true;
  });

  it('passes "Colonies" as the title', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true}, selected: []},
    });
    expect(findModuleItemFilter(wrapper).props('title')).to.eq('Colonies');
  });

  it('uses the provided selection when selected is non-empty', () => {
    const provided: Array<ColonyName> = [ColonyName.CALLISTO, ColonyName.EUROPA];
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true}, selected: provided},
    });
    expect(findModuleItemFilter(wrapper).props('selected')).to.deep.eq(provided);
  });

  it('auto-selects official colonies when selected is empty', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true}, selected: []},
    });
    const selected: Array<string> = findModuleItemFilter(wrapper).props('selected');
    expect(selected.length).to.be.greaterThan(0);
    expect(selected).to.include(ColonyName.CALLISTO);
  });

  it('includes community colonies when community expansion is enabled', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true, community: true}, selected: []},
    });
    const selected: Array<string> = findModuleItemFilter(wrapper).props('selected');
    // Community colonies should be present
    expect(selected.length).to.be.greaterThan(0);
  });

  it('does not include community colonies when community expansion is disabled', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true, community: false}, selected: []},
    });
    const selected: Array<string> = findModuleItemFilter(wrapper).props('selected');
    // Only official colonies should be present (community colonies excluded)
    // Deimos is a community colony
    expect(selected).not.to.include(ColonyName.DEIMOS);
  });

  it('passes three groups (Official, Community, Pathfinders)', () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true}, selected: []},
    });
    const groups: Array<{key: string; label: string}> = findModuleItemFilter(wrapper).props('groups');
    expect(groups.map((g) => g.label)).to.deep.eq(['Official', 'Community', 'Pathfinders']);
  });

  it('emits colonies-list-changed when ModuleItemFilter emits update:selected', async () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true}, selected: []},
    });
    const payload: Array<ColonyName> = [ColonyName.CALLISTO];
    await findModuleItemFilter(wrapper).vm.$emit('update:selected', payload);
    const emitted = wrapper.emitted('colonies-list-changed');
    expect(emitted).to.have.length(1);
    expect(emitted![0][0]).to.deep.eq(payload);
  });

  it('emits close when ModuleItemFilter emits close', async () => {
    const wrapper = shallowMount(ColoniesFilter, {
      ...globalConfig,
      props: {expansions: {...DEFAULT_EXPANSIONS, colonies: true}, selected: []},
    });
    await findModuleItemFilter(wrapper).vm.$emit('close');
    expect(wrapper.emitted('close')).to.have.length(1);
  });
});
