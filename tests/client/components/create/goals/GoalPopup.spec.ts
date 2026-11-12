import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../../getLocalVue';
import GoalPopup from '@/client/components/create/goals/GoalPopup.vue';
describe('GoalPopup', () => {
  it('mounts without errors', () => {
    const wrapper = mount(GoalPopup, {
      ...globalConfig,
      props: {
        modelValue: {
          type: 'board',
          random: {
            pool: 'maps',
            randomness: 'limited',
          },
          selected: {milestones: [], awards: []}},
        limit: 5},
    });
    expect(wrapper.exists()).is.true;
  });
});
