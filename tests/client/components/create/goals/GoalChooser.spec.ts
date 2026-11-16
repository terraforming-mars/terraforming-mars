import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../../getLocalVue';
import GoalChooser from '@/client/components/create/goals/GoalChooser.vue';

describe('GoalChooser', () => {
  it('mounts without errors', () => {
    const wrapper = mount(GoalChooser, {
      ...globalConfig,
      props: {selected: {milestones: [], awards: []}, limit: 5},
    });
    expect(wrapper.exists()).is.true;
  });
});
