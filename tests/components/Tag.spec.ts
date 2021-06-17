
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import Tag from '../../src/components/Tag.vue';

describe('Tag', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    return localVue;
  }
  it('getClasses with only tag', function() {
    const tag = mount(Tag, {
      localVue: getLocalVue(),
      propsData: {
        tag: 'vp',
        size: 'big',
        type: 'main',
      },
    });
    expect(tag.find('div[class="tag-count tag-vp tag-size-big tag-type-main"]').exists()).is.true;
  });
});
