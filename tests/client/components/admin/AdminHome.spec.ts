import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import AdminHome from '@/client/components/admin/AdminHome.vue';

describe('AdminHome', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(AdminHome, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
