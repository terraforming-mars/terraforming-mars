import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardResourceCounter from '@/client/components/card/CardResourceCounter.vue';
import {CardResource} from '@/common/CardResource';

describe('CardResourceCounter', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardResourceCounter, {
      ...globalConfig,
      props: {
        amount: 3,
        type: CardResource.MICROBE,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
