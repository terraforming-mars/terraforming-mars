import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import LogMessageInspector from '@/client/components/logpanel/LogMessageInspector.vue';
import {fakeViewModel} from '../testHelpers';

describe('LogMessageInspector', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(LogMessageInspector, {
      ...globalConfig,
      props: {
        viewModel: fakeViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
