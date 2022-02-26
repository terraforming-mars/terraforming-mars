import {mount, Wrapper} from '@vue/test-utils';
import {expect} from 'chai';
import PreferencesDialog from '@/client/components/PreferencesDialog.vue';
import {Preference, PreferencesManager} from '@/client/utils/PreferencesManager';
import {getLocalVue} from './getLocalVue';

describe('PreferencesDialog', () => {
  const preferencesManager = PreferencesManager.INSTANCE;

  function getDataTest(wrapper: Wrapper<PreferencesDialog>, field: Preference): Wrapper<PreferencesDialog> {
    return wrapper.find(`[data-test=${field}]`);
  }

  function getCheckbox(wrapper: Wrapper<PreferencesDialog>, field: Preference): HTMLInputElement {
    return getDataTest(wrapper, field).element as HTMLInputElement;
  }

  it('defaults properly set', () => {
    const wrapper = mount(PreferencesDialog, {
      localVue: getLocalVue(),
      propsData: {preferencesManager},
    });

    expect(preferencesManager.values().hide_awards_and_milestones).is.false;
    expect(getCheckbox(wrapper, 'hide_awards_and_milestones').checked).is.false;

    expect(getCheckbox(wrapper, 'learner_mode').checked).is.true;
    expect(preferencesManager.values().learner_mode).is.true;
  });

  it('toggling sets the underlying preferences', async () => {
    const wrapper = mount(PreferencesDialog, {
      localVue: getLocalVue(),
      propsData: {preferencesManager},
    });

    expect(preferencesManager.values().hide_awards_and_milestones).is.false;

    const cbWrapper = getDataTest(wrapper, 'hide_awards_and_milestones');
    const cb = getCheckbox(wrapper, 'hide_awards_and_milestones');
    cb.checked = true;
    cbWrapper.trigger('change');
    await wrapper.vm.$nextTick();

    expect(preferencesManager.values().hide_awards_and_milestones).is.true;
  });
});
