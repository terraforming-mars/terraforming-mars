import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import BugReportDialog from '@/client/components/BugReportDialog.vue';

describe('BugReportDialog', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(BugReportDialog, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
