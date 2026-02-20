import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardRequirementsComponent from '@/client/components/card/CardRequirementsComponent.vue';

describe('CardRequirementsComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRequirementsComponent, {
      localVue: getLocalVue(),
      propsData: {
        requirements: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
