import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import TopBar from '@/client/components/TopBar.vue';
import {fakePlayerViewModel} from './testHelpers';
import {useFakeLocalStorage} from './FakeLocalStorage';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('TopBar', () => {
  useFakeLocalStorage();

  it('mounts without errors', () => {
    const wrapper = shallowMount(TopBar, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      },
      props: {
        playerView: fakePlayerViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('collapses and expands when toggled', async () => {
    PreferencesManager.INSTANCE.set('hide_top_bar', false);
    const wrapper = shallowMount(TopBar, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel(),
      },
    });
    expect(wrapper.find('.top-bar').classes()).to.not.include('top-bar-collapsed');

    await wrapper.find('.top-bar-collapser').trigger('click');
    expect(wrapper.find('.top-bar').classes()).to.include('top-bar-collapsed');

    await wrapper.find('.top-bar-collapser').trigger('click');
    expect(wrapper.find('.top-bar').classes()).to.not.include('top-bar-collapsed');
  });
});
