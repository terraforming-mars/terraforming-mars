import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import AdminHome from '@/client/components/admin/AdminHome.vue';

describe('AdminHome', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(AdminHome, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
