import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import HelpStandardProjects from '@/client/components/help/HelpStandardProjects.vue';

describe('HelpStandardProjects', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(HelpStandardProjects, {
      localVue: getLocalVue(),
    });
    expect(wrapper.exists()).to.be.true;
  });
});
