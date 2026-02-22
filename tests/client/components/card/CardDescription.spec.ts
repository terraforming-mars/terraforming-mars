import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardDescription from '@/client/components/card/CardDescription.vue';

describe('CardDescription', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardDescription, {
      localVue: getLocalVue(),
      propsData: {
        item: 'A test description',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
