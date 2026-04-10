import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';

describe('GlobalEvent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GlobalEvent, {
      ...globalConfig,
      props: {
        globalEventName: GlobalEventName.GLOBAL_DUST_STORM,
        type: 'current',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
