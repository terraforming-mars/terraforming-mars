import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SelectGlobalEvent from '@/client/components/SelectGlobalEvent.vue';
import {fakePlayerViewModel} from './testHelpers';

describe('SelectGlobalEvent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectGlobalEvent, {
      localVue: getLocalVue(),
      propsData: {
        playerView: fakePlayerViewModel(),
        playerinput: {
          title: 'Select a global event',
          buttonLabel: 'Save',
          type: 'globalEvent',
          globalEventNames: [],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
