import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import GoToMap from '@/client/components/waitingFor/GoToMap.vue';

describe('GoToMap', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(GoToMap, {
      ...globalConfig,
      props: {
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
