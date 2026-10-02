import {shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import PlayerTagSubstitution from '@/client/components/overview/PlayerTagSubstitution.vue';
import {Tag} from '@/common/cards/Tag';

describe('PlayerTagSubstitution', () => {
  it('renders the substituting tag', () => {
    const wrapper = shallowMount(PlayerTagSubstitution, {
      ...globalConfig,
      props: {
        tag: Tag.MOON,
      },
    });
    expect(wrapper.find('.player-tag-substitution-icon').classes()).contains('tag-moon');
  });
});
