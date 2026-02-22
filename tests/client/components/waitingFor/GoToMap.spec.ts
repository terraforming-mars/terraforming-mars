import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import GoToMap from '@/client/components/waitingFor/GoToMap.vue';

describe('GoToMap', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GoToMap, {
      localVue: getLocalVue(),
      propsData: {
        playerinput: {
          title: 'Select a space',
          buttonLabel: 'Save',
          type: 'space',
          spaces: [],
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
