import {DOMWrapper, shallowMount} from '@vue/test-utils';
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

type Group = {key: GameModule, label: string};
const GROUPS: Array<Group> = [
  {key: 'venus', label: 'Group Alpha'},
  {key: 'moon', label: 'Group Beta'},
];

const ITEMS_BY_GROUP: Record<string, Array<string>> = {
  venus: ['item-a1', 'item-a2'],
  moon: ['item-b1'],
};

type MountOptions = {
  selected?: Array<string>,
  groups?: Array<Group>,
  itemsByGroup?: Record<string, Array<string>>,
};

function mountFilter(overrides: MountOptions = {}) {
  return shallowMount(ModuleItemFilter, {
    ...globalConfig,
    global: {
      ...globalConfig.global,
      stubs: {PopupPanel: PopupPanelStub},
    },
    props: {
      title: 'Test Filter',
      groups: overrides.groups ?? GROUPS,
      itemsByGroup: overrides.itemsByGroup ?? ITEMS_BY_GROUP,
      selected: overrides.selected ?? [],
    },
    slots: {
      item: ({itemName}: {itemName: string}) => h('span', {class: 'item-label'}, itemName),
    },
  });
}

type FilterWrapper = ReturnType<typeof mountFilter>;

function selected(wrapper: FilterWrapper): Array<string> {
  return wrapper.findAll<HTMLInputElement>('input[type=checkbox]')
    .filter((input) => input.element.checked)
    .map((input) => input.element.value);
}

function group(wrapper: FilterWrapper, label: string): DOMWrapper<Element> {
  const found = wrapper.findAll('.corporations-filter-group')
    .find((element) => element.text().includes(label));
  if (found === undefined) {
    throw new Error(`Group not found: ${label}`);
  }
  return found;
}

async function clickText(scope: FilterWrapper | DOMWrapper<Element>, text: string): Promise<void> {
  const link = scope.findAll('a').find((element) => element.text() === text);
  if (link === undefined) {
    throw new Error(`Link not found: ${text}`);
  }
  await link.trigger('click');
}

function visibleItemLabels(wrapper: FilterWrapper): Array<string> {
  return wrapper.findAll('.item-label')
    .filter((label) => label.isVisible())
    .map((label) => label.text());
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
    const wrapper = mountFilter({itemsByGroup: {venus: ['item-a1'], moon: []}});
    expect(wrapper.text()).to.include('Group Alpha');
    expect(wrapper.text()).not.to.include('Group Beta');
  });

  it('initialises the selection from the selected prop', () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    expect(selected(wrapper)).to.deep.eq(['item-a1']);
  });

  // --- selectAll ---

  it('selectAll("All") adds every item across all groups', async () => {
    const wrapper = mountFilter();
    await clickText(wrapper, 'All*');
    expect(selected(wrapper)).to.have.members(['item-a1', 'item-a2', 'item-b1']);
  });

  it('selectAll(group) adds only items from that group', async () => {
    const wrapper = mountFilter();
    await clickText(group(wrapper, 'Group Alpha'), 'All');
    expect(selected(wrapper)).to.have.members(['item-a1', 'item-a2']);
    expect(selected(wrapper)).not.to.include('item-b1');
  });

  it('selectAll does not add duplicates', async () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    await clickText(group(wrapper, 'Group Alpha'), 'All');
    await clickText(group(wrapper, 'Group Alpha'), 'All');
    expect(selected(wrapper)).to.deep.eq(['item-a1', 'item-a2']);
  });

  // --- selectNone ---

  it('selectNone("All") removes every item', async () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-a2', 'item-b1']});
    await clickText(wrapper, 'None*');
    expect(selected(wrapper)).to.be.empty;
  });

  it('selectNone(group) removes only items from that group', async () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-a2', 'item-b1']});
    await clickText(group(wrapper, 'Group Alpha'), 'None');
    expect(selected(wrapper)).to.deep.eq(['item-b1']);
  });

  // --- invertSelection ---

  it('invertSelection("All") toggles every item', async () => {
    const wrapper = mountFilter({selected: ['item-a1']});
    await clickText(wrapper, 'Invert*');
    expect(selected(wrapper)).to.have.members(['item-a2', 'item-b1']);
  });

  it('invertSelection(group) toggles only items in that group', async () => {
    const wrapper = mountFilter({selected: ['item-a1', 'item-b1']});
    await clickText(group(wrapper, 'Group Alpha'), 'Invert');
    expect(selected(wrapper)).to.have.members(['item-a2', 'item-b1']);
  });

  // --- watchSelect ---

  it('watchSelect(key, true) selects the group', async () => {
    const wrapper = mountFilter();
    wrapper.vm.watchSelect('moon', true);
    await wrapper.vm.$nextTick();
    expect(selected(wrapper)).to.include('item-b1');
  });

  it('watchSelect(key, false) deselects the group', async () => {
    const wrapper = mountFilter({selected: ['item-b1']});
    wrapper.vm.watchSelect('moon', false);
    await wrapper.vm.$nextTick();
    expect(selected(wrapper)).not.to.include('item-b1');
  });

  // --- include (text filter) ---

  it('include returns true when the filter is empty', () => {
    const wrapper = mountFilter();
    expect(visibleItemLabels(wrapper)).to.have.members(['item-a1', 'item-a2', 'item-b1']);
  });

  it('include matches a case-insensitive substring', async () => {
    const wrapper = mountFilter();
    await wrapper.find('input.filter').setValue('ITEM-A1');
    expect(visibleItemLabels(wrapper)).to.deep.eq(['item-a1']);
  });

  it('include hides items that do not match', async () => {
    const wrapper = mountFilter();
    await wrapper.find('input.filter').setValue('zzz');
    expect(visibleItemLabels(wrapper)).to.be.empty;
  });

  // --- icon ---

  it('icon returns the correct expansion CSS class', () => {
    const wrapper = mountFilter();
    expect(group(wrapper, 'Group Alpha').find('.create-game-expansion-icon').classes())
      .to.include('expansion-icon-venus');
  });

  it('icon maps "colonies" to "colony" suffix', () => {
    const wrapper = mountFilter({
      groups: [{key: 'colonies', label: 'Colonies'}],
      itemsByGroup: {colonies: ['item-c']},
    });
    expect(group(wrapper, 'Colonies').find('.create-game-expansion-icon').classes())
      .to.include('expansion-icon-colony');
  });

  it('icon maps "corpera" to "CE" suffix', () => {
    const wrapper = mountFilter({
      groups: [{key: 'corpera', label: 'Corporations'}],
      itemsByGroup: {corpera: ['item-c']},
    });
    expect(group(wrapper, 'Corporations').find('.create-game-expansion-icon').classes())
      .to.include('expansion-icon-CE');
  });

  it('icon maps "moon" to "themoon" suffix', () => {
    const wrapper = mountFilter({
      groups: [{key: 'moon', label: 'Moon'}],
      itemsByGroup: {moon: ['item-m']},
    });
    expect(group(wrapper, 'Moon').find('.create-game-expansion-icon').classes())
      .to.include('expansion-icon-themoon');
  });

  // --- emit ---

  it('emits update:selected when the selection changes', async () => {
    const wrapper = mountFilter();
    await clickText(wrapper, 'All*');
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
