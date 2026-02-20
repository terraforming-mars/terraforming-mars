import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardRenderEffectBoxComponent from '@/client/components/card/CardRenderEffectBoxComponent.vue';

describe('CardRenderEffectBoxComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderEffectBoxComponent, {
      localVue: getLocalVue(),
      propsData: {
        effectData: {
          is: 'effect',
          rows: [[], [], []],
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
