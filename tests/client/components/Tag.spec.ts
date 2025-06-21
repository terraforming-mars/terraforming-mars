
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import Tag from '@/client/components/Tag.vue';

describe('Tag', () => {
  it('getClasses with only tag', () => {
    const tag = mount(Tag, {
      localVue: getLocalVue(),
      propsData: {
        tag: 'vp',
        size: 'big',
        type: 'main',
      },
    });
    expect(tag.find('div[class="tag-count tooltip tooltip-bottom tag-vp tag-size-big tag-type-main"]').exists()).is.true;
  });
});
