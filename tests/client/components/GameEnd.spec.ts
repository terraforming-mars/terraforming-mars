import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import GameEnd from '@/client/components/GameEnd.vue';
import {fakePlayerViewModel, fakeSpectatorModel} from './testHelpers';

describe('GameEnd', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameEnd, {
      localVue: getLocalVue(),
      propsData: {
        playerView: fakePlayerViewModel(),
        spectator: fakeSpectatorModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
