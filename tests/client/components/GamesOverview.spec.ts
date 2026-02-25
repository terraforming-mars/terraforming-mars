import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GamesOverview from '@/client/components/GamesOverview.vue';

describe('GamesOverview', () => {
  let originalFetch: any;

  beforeEach(() => {
    originalFetch = (global as any).fetch;
    (global as any).fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(GamesOverview, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
