import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {globalConfig} from '../../getLocalVue';
import GoalButton from '@/client/components/create/goals/GoalButton.vue';

describe('GoalButton', () => {
  it('mounts without errors', () => {
    const wrapper = mount(GoalButton, {
      ...globalConfig,
      props: {modelValue: {type: 'board', random: {pool: 'maps', randomness: 'limited'}, selected: {milestones: [], awards: []}}, expansions: DEFAULT_EXPANSIONS},
    });
    expect(wrapper.exists()).is.true;
  });
});
