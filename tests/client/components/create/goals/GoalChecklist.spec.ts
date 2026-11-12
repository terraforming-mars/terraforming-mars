import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../../getLocalVue';
import {MilestoneName} from '@/common/ma/MilestoneName';
import {AwardName} from '@/common/ma/AwardName';
import GoalChecklist from '@/client/components/create/goals/GoalChecklist.vue';

const ITEMS = [
  {name: 'Gardener', expansion: undefined},
  {name: 'Mayor', expansion: undefined},
  {name: 'Tactician', expansion: undefined},
  {name: 'Tactician4', expansion: undefined},
  {name: 'Terraformer', expansion: 'moon'},
] as const;

function mountChecklist(selected: ReadonlyArray<MilestoneName | AwardName>, limit = 5, filterText = '') {
  return mount(GoalChecklist, {
    ...globalConfig,
    props: {heading: 'Milestones', items: ITEMS, selected, limit, filterText},
  });
}

type Wrapper = ReturnType<typeof mountChecklist>;

function checkbox(wrapper: Wrapper, name: string) {
  return wrapper.find(`input[type="checkbox"][value="${name}"]`);
}

function isChecked(wrapper: Wrapper, name: string): boolean {
  return (checkbox(wrapper, name).element as HTMLInputElement).checked;
}

describe('GoalChecklist', () => {
  it('shows the heading with the count', () => {
    const wrapper = mountChecklist(['Terraformer'], 5);
    expect(wrapper.find('.create-game-ma-heading').text().replace(/\u00a0/g, ' ')).eq('Milestones (1/5)');
  });

  it('checks the selected items', () => {
    const wrapper = mountChecklist(['Terraformer']);
    expect(isChecked(wrapper, 'Terraformer')).is.true;
    expect(isChecked(wrapper, 'Mayor')).is.false;
  });

  it('shows a trailing number in parentheses', () => {
    const wrapper = mountChecklist([]);
    expect(checkbox(wrapper, 'Tactician4').element.closest('label')?.textContent?.replace(/\u00a0/g, ' ')).contains('Tactician (4)');
    expect(checkbox(wrapper, 'Tactician').element.closest('label')?.textContent).not.contains('(');
  });

  it('shows the icon of the expansion an item needs', () => {
    const wrapper = mountChecklist([]);
    expect(checkbox(wrapper, 'Terraformer').element.closest('label')?.querySelector('.expansion-icon-themoon')).is.not.null;
    expect(checkbox(wrapper, 'Mayor').element.closest('label')?.querySelector('.create-game-expansion-icon')).is.null;
  });

  it('disables unselected items once the limit is reached', () => {
    const wrapper = mountChecklist(['Terraformer', 'Mayor'], 2);
    expect(checkbox(wrapper, 'Gardener').attributes('disabled')).is.not.undefined;
    expect(checkbox(wrapper, 'Mayor').attributes('disabled')).is.undefined;
  });

  it('hides items whose labels don\'t match the filter', () => {
    const wrapper = mountChecklist([], 5, 'tact');
    expect(checkbox(wrapper, 'Tactician4').element.closest('.create-game-ma-item')?.getAttribute('style') ?? '').not.contains('display: none');
    expect(checkbox(wrapper, 'Mayor').element.closest('.create-game-ma-item')?.getAttribute('style')).contains('display: none');
  });

  it('emits the new selection', async () => {
    const wrapper = mountChecklist(['Terraformer']);
    await checkbox(wrapper, 'Mayor').setValue(true);
    expect(wrapper.emitted('update:selected')?.at(-1)).deep.eq([['Terraformer', 'Mayor']]);
  });
});
