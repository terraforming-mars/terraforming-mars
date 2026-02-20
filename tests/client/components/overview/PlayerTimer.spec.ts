import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import PlayerTimer from '@/client/components/overview/PlayerTimer.vue';
import {fakeTimerModel} from '../testHelpers';

describe('PlayerTimer', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerTimer, {
      localVue: getLocalVue(),
      propsData: {
        timer: fakeTimerModel(),
        live: false,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
