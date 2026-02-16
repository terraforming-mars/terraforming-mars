import {shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import CardRequirementComponent from '@/client/components/card/CardRequirementComponent.vue';
import {Tag} from '@/common/cards/Tag';

describe('CardRequirementComponent', () => {
  it('renders temperature requirement', () => {
    const wrapper = shallowMount(CardRequirementComponent, {
      ...globalConfig,
      props: {
        requirement: {temperature: -14, count: -14},
      },
    });
    expect(wrapper.text()).to.include('-14');
    expect(wrapper.find('.card-temperature--req').exists()).to.be.true;
  });

  it('renders tag requirement', () => {
    const wrapper = shallowMount(CardRequirementComponent, {
      ...globalConfig,
      props: {
        requirement: {tag: Tag.SCIENCE, count: 2},
      },
    });
    expect(wrapper.find('.card-tag-science').exists()).to.be.true;
  });
});
