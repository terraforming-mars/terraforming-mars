import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../../getLocalVue';
import GoalRadioButton from '@/client/components/create/goals/GoalRadioButton.vue';

describe('GoalRadioButton', () => {
  it('mounts without errors', () => {
    const wrapper = mount(GoalRadioButton, {
      ...globalConfig,
      props: {heading: 'Type', name: 'test', choices: ['a', 'b'] as const, labels: {a: 'A', b: 'B'}, modelValue: 'a'},
    });
    expect(wrapper.exists()).is.true;
  });
});
