import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import UndergroundToken from '@/client/components/underworld/UndergroundToken.vue';

describe('UndergroundToken', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(UndergroundToken, {
      ...globalConfig,
      props: {
        token: {
          token: 'data1pertemp',
          shelter: false,
          active: false,
        },
        location: 'player-home',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
