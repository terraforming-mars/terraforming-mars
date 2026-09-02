import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '@tests/client/components/getLocalVue';
import App from '@/client/components/App.vue';

describe('App', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(App, globalConfig);
    expect(wrapper.exists()).to.be.true;
  });
});
