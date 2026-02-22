import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardRenderCorpBoxComponent from '@/client/components/card/CardRenderCorpBoxComponent.vue';

describe('CardRenderCorpBoxComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderCorpBoxComponent, {
      localVue: getLocalVue(),
      propsData: {
        rows: [],
        label: 'effect',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
