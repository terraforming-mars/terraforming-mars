import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardDescription from '@/client/components/card/CardDescription.vue';

describe('CardDescription', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardDescription, {
      ...globalConfig,
      props: {
        item: 'A test description',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
