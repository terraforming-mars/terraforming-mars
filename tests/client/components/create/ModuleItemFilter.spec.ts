import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {h} from 'vue';
import {globalConfig} from '../getLocalVue';
import ModuleItemFilter from '@/client/components/create/ModuleItemFilter.vue';
import {GameModule} from '@/common/cards/GameModule';

// Stub that renders both named slots so template content is accessible in tests.
const PopupPanelStub = {
  name: 'PopupPanel',
  template: '<div><slot name="header"/><slot/></div>',
  emits: ['close'],
};

const GROUPS: Array<{key: GameModule, label: string}> = [
  {key: 'venus', label: 'Group Alpha'},
  {key: 'moon', label: 'Group Beta'},
];

const ITEMS_BY_GROUP: Record<string, Array<string>> = {
  venus: ['item-a1', 'item-a2'],
  moon: ['item-b1'],
};

function mountFilter(overrides: {selected?: Array<string>} = {}) {
  return shallowMount(ModuleItemFilter, {
    ...globalConfig,
    global: {
      ...globalConfig.global,
      stubs: {PopupPanel: PopupPanelStub},
    },
    props: {
      title: 'Test Filter',
      groups: GROUPS,
      itemsByGroup: ITEMS_BY_GROUP,
      selected: overrides.selected ?? [],
    },
    slots: {
      item: ({itemName}: {itemName: string}) => h('span', {class: 'item-label'}, itemName),
    },
  });
}

// The script-setup internals are reachable through the test wrapper, but not exposed by its type.
type ModuleItemFilterVm = {
  localSelected: Array<string>;
  filterText: string;
  selectAll(key: string): void;
  selectNone(key: string): void;
  invertSelection(key: string): void;
  watchSelect(key: string, enabled: boolean): void;
  include(name: string): boolean;
  icon(module: string | undefined): string | undefined;
};

function vm(wrapper: ReturnType<typeof mountFilter>): ModuleItemFilterVm {
  return wrapper.vm as unknown as ModuleItemFilterVm;
}

describe('ModuleItemFilter', () => {
  it('renders the title in the header', () => {
    const wrapper = mountFilter();
    expect(wrapper.find('h2').text()).to.include('Test Filter');
  });

  it('renders group labels', () => {
    const wrapper = mountFilter();
    const text = wrapper.text();
    expect(text).to.include('Group Alpha');
    expect(text).to.include('Group Beta');
  });

  it('hides a group when its item list is empty', () => {
    const wrapper = shallowMount(ModuleItemFilter, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        stubs: {PopupPanel: PopupPanelStub},
      },
      props: {
        title: 'Test Filter',
        groups: GROUPS,
        itemsByGroup: {venus: ['item-a1'], moon: []},
        selected: [],
      },
    });
    expect(wrapper.text()).to.include('Group Alpha');
    expect(wrapper.text()).not.to.include('Group Beta');
  });

  it('initialises localSelected from the selected prop', () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    expect(vm(wrapper).localSelected).to.deep.eq(['item-a1']);
  });

  // --- selectAll ---

  it('selectAll("All") adds every item across all groups', () => {
    const wrapper = mountFilter();
    vm(wrapper).selectAll('All');
    expect(vm(wrapper).localSelected).to.have.members(['item-a1', 'item-a2', 'item-b1']);
  });

  it('selectAll(group) adds only items from that group', () => {
    const wrapper = mountFilter();
    vm(wrapper).selectAll('venus');
    expect(vm(wrapper).localSelected).to.have.members(['item-a1', 'item-a2']);
    expect(vm(wrapper).localSelected).not.to.include('item-b1');
  });

  it('selectAll does not add duplicates', () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    vm(wrapper).selectAll('venus');
    const selected: Array<string> = vm(wrapper).localSelected;
    expect(selected.filter((x) => x === 'item-a1')).to.have.length(1);
  });

  // --- selectNone ---

  it('selectNone("All") removes every item', () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-a2', 'item-b1']});
    vm(wrapper).selectNone('All');
    expect(vm(wrapper).localSelected).to.be.empty;
  });

  it('selectNone(group) removes only items from that group', () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-a2', 'item-b1']});
    vm(wrapper).selectNone('venus');
    expect(vm(wrapper).localSelected).to.deep.eq(['item-b1']);
  });

  // --- invertSelection ---

  it('invertSelection("All") toggles every item', () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    vm(wrapper).invertSelection('All');
    expect(vm(wrapper).localSelected).to.have.members(['item-a2', 'item-b1']);
  });

  it('invertSelection(group) toggles only items in that group', () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-b1']});
    vm(wrapper).invertSelection('venus');
    // item-a1 removed, item-a2 added; item-b1 untouched
    expect(vm(wrapper).localSelected).to.have.members(['item-a2', 'item-b1']);
  });

  // --- watchSelect ---

  it('watchSelect(key, true) calls selectAll for the group', () => {
    const wrapper = mountFilter();
    vm(wrapper).watchSelect('moon', true);
    expect(vm(wrapper).localSelected).to.include('item-b1');
  });

  it('watchSelect(key, false) calls selectNone for the group', () => {
    const wrapper = mountFilter({selected: ['item-b1']});
    vm(wrapper).watchSelect('moon', false);
    expect(vm(wrapper).localSelected).not.to.include('item-b1');
  });

  // --- include (text filter) ---

  it('include returns true when filterText is empty', () => {
    const wrapper = mountFilter();
    expect(vm(wrapper).include('anything')).to.be.true;
  });

  it('include returns true for a case-insensitive substring match', () => {
    const wrapper = mountFilter();
    vm(wrapper).filterText = 'ITEM';
    expect(vm(wrapper).include('item-a1')).to.be.true;
  });

  it('include returns false when the name does not match', () => {
    const wrapper = mountFilter();
    vm(wrapper).filterText = 'zzz';
    expect(vm(wrapper).include('item-a1')).to.be.false;
  });

  // --- icon ---

  it('icon returns the correct expansion CSS class', () => {
    const wrapper = mountFilter();
    expect(vm(wrapper).icon('base')).to.eq('create-game-expansion-icon expansion-icon-base');
  });

  it('icon maps "colonies" to "colony" suffix', () => {
    const wrapper = mountFilter();
    expect(vm(wrapper).icon('colonies')).to.eq('create-game-expansion-icon expansion-icon-colony');
  });

  it('icon maps "corpera" to "CE" suffix', () => {
    const wrapper = mountFilter();
    expect((wrapper.vm as any).icon('corpera')).to.eq('create-game-expansion-icon expansion-icon-CE');
  });

  it('icon maps "moon" to "themoon" suffix', () => {
    const wrapper = mountFilter();
    expect(vm(wrapper).icon('moon')).to.eq('create-game-expansion-icon expansion-icon-themoon');
  });

  it('icon returns undefined when module is undefined', () => {
    const wrapper = mountFilter();
    expect(vm(wrapper).icon(undefined)).to.be.undefined;
  });

  // --- emit ---

  it('emits update:selected when localSelected changes', async () => {
    const wrapper = mountFilter();
    vm(wrapper).selectAll('All');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('update:selected');
    expect(emitted).to.not.be.null;
    expect(emitted!.length).to.be.greaterThan(0);
    expect(emitted![emitted!.length - 1][0]).to.have.members(['item-a1', 'item-a2', 'item-b1']);
  });

  it('emits close when PopupPanel emits close', async () => {
    const wrapper = mountFilter();
    await wrapper.findComponent({name: 'PopupPanel'}).vm.$emit('close');
    expect(wrapper.emitted('close')).to.have.length(1);
  });

  // --- slot ---

  it('renders slot content for each item', () => {
    const wrapper = mountFilter();
    const labels = wrapper.findAll('.item-label');
    expect(labels.map((l) => l.text())).to.have.members(['item-a1', 'item-a2', 'item-b1']);
  });
});
