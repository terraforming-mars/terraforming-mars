import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import LoginHome from '@/client/components/auth/LoginHome.vue';

describe('LoginHome', () => {
  let originalFetch: any;

  beforeEach(() => {
    originalFetch = (global as any).fetch;
    (global as any).fetch = () => Promise.resolve({ok: false, statusText: 'stubbed'});
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(LoginHome, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
