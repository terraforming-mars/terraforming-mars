import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {h} from 'vue';
import {globalConfig} from '../getLocalVue';
import ModuleItemFilter from '@/client/components/create/ModuleItemFilter.vue';

// Stub that renders both named slots so template content is accessible in tests.
const PopupPanelStub = {
  name: 'PopupPanel',
  template: '<div><slot name="header"/><slot/></div>',
  emits: ['close'],
};

const GROUPS = [
  {key: 'alpha', label: 'Group Alpha'},
  {key: 'beta', label: 'Group Beta'},
];

const ITEMS_BY_GROUP: Record<string, Array<string>> = {
  alpha: ['item-a1', 'item-a2'],
  beta: ['item-b1'],
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
        itemsByGroup: {alpha: ['item-a1'], beta: []},
        selected: [],
      },
    });
    expect(wrapper.text()).to.include('Group Alpha');
    expect(wrapper.text()).not.to.include('Group Beta');
  });

  it('initialises localSelected from the selected prop', () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    expect((wrapper.vm as any).localSelected).to.deep.eq(['item-a1']);
  });

  // --- selectAll ---

  it('selectAll("All") adds every item across all groups', () => {
    const wrapper = mountFilter();
    (wrapper.vm as any).selectAll('All');
    expect((wrapper.vm as any).localSelected).to.have.members(['item-a1', 'item-a2', 'item-b1']);
  });

  it('selectAll(group) adds only items from that group', () => {
    const wrapper = mountFilter();
    (wrapper.vm as any).selectAll('alpha');
    expect((wrapper.vm as any).localSelected).to.have.members(['item-a1', 'item-a2']);
    expect((wrapper.vm as any).localSelected).not.to.include('item-b1');
  });

  it('selectAll does not add duplicates', () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    (wrapper.vm as any).selectAll('alpha');
    const selected: Array<string> = (wrapper.vm as any).localSelected;
    expect(selected.filter((x) => x === 'item-a1')).to.have.length(1);
  });

  // --- selectNone ---

  it('selectNone("All") removes every item', () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-a2', 'item-b1']});
    (wrapper.vm as any).selectNone('All');
    expect((wrapper.vm as any).localSelected).to.be.empty;
  });

  it('selectNone(group) removes only items from that group', () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-a2', 'item-b1']});
    (wrapper.vm as any).selectNone('alpha');
    expect((wrapper.vm as any).localSelected).to.deep.eq(['item-b1']);
  });

  // --- invertSelection ---

  it('invertSelection("All") toggles every item', () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    (wrapper.vm as any).invertSelection('All');
    expect((wrapper.vm as any).localSelected).to.have.members(['item-a2', 'item-b1']);
  });

  it('invertSelection(group) toggles only items in that group', () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-b1']});
    (wrapper.vm as any).invertSelection('alpha');
    // item-a1 removed, item-a2 added; item-b1 untouched
    expect((wrapper.vm as any).localSelected).to.have.members(['item-a2', 'item-b1']);
  });

  // --- watchSelect ---

  it('watchSelect(key, true) calls selectAll for the group', () => {
    const wrapper = mountFilter();
    (wrapper.vm as any).watchSelect('beta', true);
    expect((wrapper.vm as any).localSelected).to.include('item-b1');
  });

  it('watchSelect(key, false) calls selectNone for the group', () => {
    const wrapper = mountFilter({selected: ['item-b1']});
    (wrapper.vm as any).watchSelect('beta', false);
    expect((wrapper.vm as any).localSelected).not.to.include('item-b1');
  });

  // --- include (text filter) ---

  it('include returns true when filterText is empty', () => {
    const wrapper = mountFilter();
    expect((wrapper.vm as any).include('anything')).to.be.true;
  });

  it('include returns true for a case-insensitive substring match', () => {
    const wrapper = mountFilter();
    (wrapper.vm as any).filterText = 'ITEM';
    expect((wrapper.vm as any).include('item-a1')).to.be.true;
  });

  it('include returns false when the name does not match', () => {
    const wrapper = mountFilter();
    (wrapper.vm as any).filterText = 'zzz';
    expect((wrapper.vm as any).include('item-a1')).to.be.false;
  });

  // --- icon ---

  it('icon returns the correct expansion CSS class', () => {
    const wrapper = mountFilter();
    expect((wrapper.vm as any).icon('base')).to.eq('create-game-expansion-icon expansion-icon-base');
  });

  it('icon maps "colonies" to "colony" suffix', () => {
    const wrapper = mountFilter();
    expect((wrapper.vm as any).icon('colonies')).to.eq('create-game-expansion-icon expansion-icon-colony');
  });

  it('icon maps "moon" to "themoon" suffix', () => {
    const wrapper = mountFilter();
    expect((wrapper.vm as any).icon('moon')).to.eq('create-game-expansion-icon expansion-icon-themoon');
  });

  it('icon returns undefined when module is undefined', () => {
    const wrapper = mountFilter();
    expect((wrapper.vm as any).icon(undefined)).to.be.undefined;
  });

  // --- emit ---

  it('emits update:selected when localSelected changes', async () => {
    const wrapper = mountFilter();
    (wrapper.vm as any).selectAll('All');
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
