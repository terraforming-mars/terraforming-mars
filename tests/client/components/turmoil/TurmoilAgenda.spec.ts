import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';

describe('TurmoilAgenda', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(TurmoilAgenda, {
      localVue: getLocalVue(),
      propsData: {
        id: 'mfp01',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
