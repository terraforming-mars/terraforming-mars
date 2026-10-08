import {shallowMount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import Tag from '@/client/components/Tag.vue';
import {Tag as TagEnum} from '@/common/cards/Tag';

describe('Tag', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(Tag, {
      ...globalConfig,
      props: {
        tag: TagEnum.BUILDING,
        size: 'big',
        type: 'main',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
