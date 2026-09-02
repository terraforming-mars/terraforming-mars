import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardTags from '@/client/components/card/CardTags.vue';
import {Tag} from '@/common/cards/Tag';

describe('CardTags', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardTags, {
      ...globalConfig,
      props: {
        tags: [Tag.SPACE, Tag.SCIENCE],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
