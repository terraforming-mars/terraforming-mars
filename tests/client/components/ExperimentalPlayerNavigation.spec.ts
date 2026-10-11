import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import ExperimentalPlayerNavigation from '@/client/components/ExperimentalPlayerNavigation.vue';
import {globalConfig} from './getLocalVue';

describe('ExperimentalPlayerNavigation', () => {
  it('offers each game section and marks the selected one', async () => {
    const wrapper = mount(ExperimentalPlayerNavigation, {...globalConfig, props: {activePanel: 'actions', cardCount: 3}});
    expect(wrapper.get('[data-test="layout-actions"]').attributes('aria-pressed')).eq('true');
    expect(wrapper.get('[data-test="layout-cards"]').text()).include('3');
    for (const panel of ['actions', 'cards', 'board', 'players', 'log']) {
      await wrapper.get(`[data-test="layout-${panel}"]`).trigger('click');
    }
    expect(wrapper.emitted('navigate')).deep.eq([['actions'], ['cards'], ['board'], ['players'], ['log']]);
  });
});
