import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GamesOverview from '@/client/components/GamesOverview.vue';

describe('GamesOverview', () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(GamesOverview, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
