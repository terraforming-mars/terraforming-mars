import {shallowMount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import BugReportDialog from '@/client/components/BugReportDialog.vue';

describe('BugReportDialog', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(BugReportDialog, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
