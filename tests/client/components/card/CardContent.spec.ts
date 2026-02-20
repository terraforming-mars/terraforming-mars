import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardContent from '@/client/components/card/CardContent.vue';

describe('CardContent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardContent, {
      localVue: getLocalVue(),
      propsData: {
        metadata: {
          cardNumber: '001',
          renderData: undefined,
          description: undefined,
        },
        requirements: [],
        isCorporation: false,
        bottomPadding: '',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
