import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import PlayerSetupView from '@/client/components/PlayerSetupView.vue';
import {fakePlayerViewModel} from './testHelpers';
import raw_settings from '@/genfiles/settings.json';

describe('PlayerSetupView', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayerSetupView, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel(),
        settings: raw_settings,
        tileView: 'show',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
