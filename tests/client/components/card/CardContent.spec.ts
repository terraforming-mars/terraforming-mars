import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardContent from '@/client/components/card/CardContent.vue';

describe('CardContent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardContent, {
      ...globalConfig,
      props: {
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
