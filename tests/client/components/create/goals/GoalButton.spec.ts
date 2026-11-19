import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../../getLocalVue';
import GoalButton from '@/client/components/create/goals/GoalButton.vue';

describe('GoalButton', () => {
  it('mounts without errors', () => {
    const wrapper = mount(GoalButton, {
      ...globalConfig,
      props: {modelValue: {type: 'board', random: {pool: 'maps', randomness: 'limited'}, selected: {milestones: [], awards: []}}},
    });
    expect(wrapper.exists()).is.true;
  });
});
