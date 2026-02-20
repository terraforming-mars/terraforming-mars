import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import {fakeGameOptionsModel} from './testHelpers';

describe('GameSetupDetail', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GameSetupDetail, {
      localVue: getLocalVue(),
      propsData: {
        playerNumber: 2,
        gameOptions: fakeGameOptionsModel(),
        lastSoloGeneration: 14,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
