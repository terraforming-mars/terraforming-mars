import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRenderEffectBoxComponent from '@/client/components/card/CardRenderEffectBoxComponent.vue';

describe('CardRenderEffectBoxComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderEffectBoxComponent, {
      ...globalConfig,
      props: {
        effectData: {
          is: 'effect',
          rows: [[], [], []],
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
