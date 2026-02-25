import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRenderSymbolComponent from '@/client/components/card/CardRenderSymbolComponent.vue';
import {CardRenderSymbolType} from '@/common/cards/render/CardRenderSymbolType';
import {Size} from '@/common/cards/render/Size';

describe('CardRenderSymbolComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRenderSymbolComponent, {
      ...globalConfig,
      props: {
        item: {
          is: 'symbol',
          type: CardRenderSymbolType.ARROW,
          size: Size.MEDIUM,
          isIcon: false,
          isSuperscript: false,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
