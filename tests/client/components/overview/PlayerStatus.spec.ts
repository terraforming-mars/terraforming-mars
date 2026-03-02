import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlayerStatus from '@/client/components/overview/PlayerStatus.vue';
import {fakeTimerModel} from '../testHelpers';

describe('PlayerStatus', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerStatus, {
      ...globalConfig,
      props: {
        timer: fakeTimerModel(),
        actionLabel: 'none',
        showTimer: false,
        liveTimer: false,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
