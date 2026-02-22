import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardTag from '@/client/components/card/CardTag.vue';
import {Tag} from '@/common/cards/Tag';

describe('CardTag', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardTag, {
      localVue: getLocalVue(),
      propsData: {
        index: 0,
        type: Tag.SPACE,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
