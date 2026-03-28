import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';

describe('ConfirmDialog', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ConfirmDialog, {
      ...globalConfig,
      props: {
        message: 'Are you sure?',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
