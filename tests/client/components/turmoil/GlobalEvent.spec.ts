import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import GlobalEvent from '@/client/components/turmoil/GlobalEvent.vue';
import {getGlobalEvent} from '@/client/turmoil/ClientGlobalEventManifest';
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

  it('updates when the global event changes', async () => {
    const wrapper = shallowMount(GlobalEvent, {
      ...globalConfig,
      props: {
        globalEventName: GlobalEventName.GLOBAL_DUST_STORM,
        type: 'current',
      },
    });
    await wrapper.setProps({globalEventName: GlobalEventName.SPONSORED_PROJECTS});
    expect(wrapper.vm.description).to.eq(getGlobalEvent(GlobalEventName.SPONSORED_PROJECTS)?.description);
  });
});
