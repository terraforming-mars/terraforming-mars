import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SelectClaimedUndergroundToken from '@/client/components/SelectClaimedUndergroundToken.vue';
import {fakePlayerViewModel} from './testHelpers';

describe('SelectClaimedUndergroundToken', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectClaimedUndergroundToken, {
      localVue: getLocalVue(),
      propsData: {
        playerView: fakePlayerViewModel(),
        playerinput: {
          title: 'Select tokens',
          buttonLabel: 'Save',
          type: 'claimedUndergroundToken',
          max: 1,
          min: 1,
          tokens: [],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
