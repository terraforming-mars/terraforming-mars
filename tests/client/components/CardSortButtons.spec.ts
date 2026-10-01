import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import CardSortButtons from '@/client/components/CardSortButtons.vue';

describe('CardSortButtons', () => {
  it('shows no arrow when unsorted', () => {
    const buttons = mount(CardSortButtons, {...globalConfig, props: {sortOrder: undefined}});

    expect(buttons.find('.sort-arrow').exists()).is.false;
  });

  it('shows a down arrow on the current sort', () => {
    const buttons = mount(CardSortButtons, {...globalConfig, props: {sortOrder: {key: 'cost', reversed: false}}});

    expect(buttons.find('[data-test=sort-by-cost] .sort-arrow').text()).eq('▼');
    expect(buttons.find('[data-test=sort-by-type] .sort-arrow').exists()).is.false;
  });

  it('shows an up arrow on a reversed sort', () => {
    const buttons = mount(CardSortButtons, {...globalConfig, props: {sortOrder: {key: 'cost', reversed: true}}});

    expect(buttons.find('[data-test=sort-by-cost] .sort-arrow').text()).eq('▲');
  });

  it('clicking a button sorts by it', async () => {
    const buttons = mount(CardSortButtons, {...globalConfig, props: {sortOrder: {key: 'cost', reversed: true}}});

    await buttons.find('[data-test=sort-by-type]').trigger('click');

    expect(buttons.emitted('update:sortOrder')).to.deep.eq([[{key: 'type', reversed: false}]]);
  });

  it('clicking the current sort again flips its direction', async () => {
    const buttons = mount(CardSortButtons, {...globalConfig, props: {sortOrder: {key: 'cost', reversed: false}}});
    const cost = buttons.find('[data-test=sort-by-cost]');

    await cost.trigger('click');
    await buttons.setProps({sortOrder: {key: 'cost', reversed: true}});
    await cost.trigger('click');

    expect(buttons.emitted('update:sortOrder')).to.deep.eq([
      [{key: 'cost', reversed: true}],
      [{key: 'cost', reversed: false}],
    ]);
  });
});
