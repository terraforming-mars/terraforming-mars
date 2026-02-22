import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SelectParty from '@/client/components/SelectParty.vue';
import {fakePlayerViewModel} from './testHelpers';

describe('SelectParty', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectParty, {
      localVue: getLocalVue(),
      propsData: {
        playerView: fakePlayerViewModel(),
        playerinput: {
          title: 'Select a party',
          buttonLabel: 'Save',
          type: 'party',
          parties: [],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
