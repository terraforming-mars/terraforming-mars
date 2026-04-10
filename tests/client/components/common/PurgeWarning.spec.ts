import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PurgeWarning from '@/client/components/common/PurgeWarning.vue';

describe('PurgeWarning', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PurgeWarning, {
      ...globalConfig,
      props: {
        expectedPurgeTimeMs: Date.now() + 86400000,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
