import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import TerraformedBanner from '@/client/components/TerraformedBanner.vue';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('TerraformedBanner', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(TerraformedBanner, {
      ...globalConfig,
      props: {
        playerId: 'p1',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
