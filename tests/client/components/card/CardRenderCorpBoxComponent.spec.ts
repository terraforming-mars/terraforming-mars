import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRenderCorpBoxComponent from '@/client/components/card/CardRenderCorpBoxComponent.vue';

describe('CardRenderCorpBoxComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderCorpBoxComponent, {
      ...globalConfig,
      props: {
        rows: [],
        label: 'effect',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
