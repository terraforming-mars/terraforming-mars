import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SelectColony from '@/client/components/SelectColony.vue';

describe('SelectColony', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectColony, {
      localVue: getLocalVue(),
      propsData: {
        playerinput: {
          title: 'Select a colony',
          buttonLabel: 'Save',
          type: 'colony',
          coloniesModel: [],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
