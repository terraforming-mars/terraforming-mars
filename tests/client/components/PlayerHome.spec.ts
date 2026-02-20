import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import PlayerHome from '@/client/components/PlayerHome.vue';
import {fakePlayerViewModel} from './testHelpers';
import {FakeLocalStorage} from './FakeLocalStorage';
import * as raw_settings from '@/genfiles/settings.json';

describe('PlayerHome', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerHome, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      propsData: {
        playerView: fakePlayerViewModel(),
        settings: raw_settings,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
