import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRequirementsComponent from '@/client/components/card/CardRequirementsComponent.vue';

describe('CardRequirementsComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRequirementsComponent, {
      ...globalConfig,
      props: {
        requirements: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
