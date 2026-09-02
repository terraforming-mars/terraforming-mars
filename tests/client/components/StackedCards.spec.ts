import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import StackedCards from '@/client/components/StackedCards.vue';

describe('StackedCards', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(StackedCards, {
      ...globalConfig,
      props: {
        cards: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
