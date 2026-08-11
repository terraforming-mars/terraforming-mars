
import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import Tag from '@/client/components/Tag.vue';
import {Tag as TagEnum} from '@/common/cards/Tag';

describe('Tag', () => {
  it('getClasses with only tag', () => {
    const tag = mount(Tag, {
      ...globalConfig,
      props: {
        tag: TagEnum.BUILDING,
        size: 'big',
        type: 'main',
      },
    });
    expect(tag.find('div[class="tag-count tooltip tooltip-bottom tag-building tag-size-big tag-type-main"]').exists()).is.true;
  });
});
