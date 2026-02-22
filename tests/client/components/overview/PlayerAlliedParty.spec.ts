import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import PlayerAlliedParty from '@/client/components/overview/PlayerAlliedParty.vue';
import {fakePublicPlayerModel} from '../testHelpers';

describe('PlayerAlliedParty', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerAlliedParty, {
      localVue: getLocalVue(),
      propsData: {
        player: fakePublicPlayerModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
