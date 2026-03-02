import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlayerAlliedParty from '@/client/components/overview/PlayerAlliedParty.vue';
import {fakePublicPlayerModel} from '../testHelpers';

describe('PlayerAlliedParty', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerAlliedParty, {
      ...globalConfig,
      props: {
        player: fakePublicPlayerModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
