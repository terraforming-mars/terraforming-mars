
import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import TagCount from '@/client/components/TagCount.vue';

describe('TagCount', () => {
  it('renders with no count', () => {
    const tagCount = mount(TagCount, {
      ...globalConfig,
      props: {
        count: 0,
      },
    });
    expect(tagCount.find('div[class="tag-display tag-no-show"]').exists()).is.true;
    expect(tagCount.find('span[class="tag-count-display tag-count-no-show"]').exists()).is.true;
  });
  it('renders with count', () => {
    const tagCount = mount(TagCount, {
      ...globalConfig,
      props: {
        count: 2,
      },
    });
    expect(tagCount.find('div[class="tag-display"]').exists()).is.true;
    expect(tagCount.find('span[class="tag-count-display"]').exists()).is.true;
  });
});
