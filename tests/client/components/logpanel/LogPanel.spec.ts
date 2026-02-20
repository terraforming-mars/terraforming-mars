import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import {fakeViewModel} from '../testHelpers';

describe('LogPanel', () => {
  let originalFetch: any;

  beforeEach(() => {
    originalFetch = (global as any).fetch;
    (global as any).fetch = () => Promise.resolve({ok: false, statusText: 'stubbed'});
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(LogPanel, {
      localVue: getLocalVue(),
      propsData: {
        viewModel: fakeViewModel(),
        color: 'blue',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
