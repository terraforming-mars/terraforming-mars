import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import OtherPlayer from '@/client/components/OtherPlayer.vue';
import {fakePublicPlayerModel} from './testHelpers';

describe('OtherPlayer', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(OtherPlayer, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      propsData: {
        player: fakePublicPlayerModel(),
        playerIndex: 0,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
