import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SelectDelegate from '@/client/components/SelectDelegate.vue';

describe('SelectDelegate', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectDelegate, {
      localVue: getLocalVue(),
      propsData: {
        players: [],
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
