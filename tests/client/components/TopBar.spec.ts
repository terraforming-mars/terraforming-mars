import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import TopBar from '@/client/components/TopBar.vue';
import {fakePlayerViewModel} from './testHelpers';
import {FakeLocalStorage} from './FakeLocalStorage';

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
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      propsData: {
        playerView: fakePlayerViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
