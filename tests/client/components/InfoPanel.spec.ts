import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import InfoPanel from '@/client/components/InfoPanel.vue';
import {fakeGameOptionsModel} from './testHelpers';

describe('InfoPanel', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(InfoPanel, {
      ...globalConfig,
      props: {
        gameOptions: fakeGameOptionsModel(),
        playerNumber: 2,
        lastSoloGeneration: 14,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
