import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import TopBar from '@/client/components/TopBar.vue';
import {fakePlayerViewModel} from './testHelpers';
import {FakeLocalStorage} from './FakeLocalStorage';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('TopBar', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(TopBar, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
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
