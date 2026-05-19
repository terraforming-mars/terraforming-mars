import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectDelegate from '@/client/components/SelectDelegate.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';

describe('SelectDelegate', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectDelegate, {
      ...globalConfig,
      props: {
        playerView: {players: []} as unknown as PlayerViewModel,
        playerinput: {
          title: 'Select a delegate',
          buttonLabel: 'Save',
          type: 'delegate',
          players: ['NEUTRAL'],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
