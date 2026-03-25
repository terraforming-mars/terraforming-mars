import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import HelpStandardProjects from '@/client/components/help/HelpStandardProjects.vue';

describe('HelpStandardProjects', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpStandardProjects, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
