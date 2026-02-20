import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';

describe('ConfirmDialog', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ConfirmDialog, {
      localVue: getLocalVue(),
      propsData: {
        message: 'Are you sure?',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
