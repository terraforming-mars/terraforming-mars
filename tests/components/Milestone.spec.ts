
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import Milestone from '../../src/components/Milestone.vue';
import {ClaimedMilestoneModel} from '../../src/models/ClaimedMilestoneModel';

describe('Milestone', function() {
  const mockMilestone: ClaimedMilestoneModel = {
    milestone: {
      name: 'test',
      description: 'a test',
      canClaim: () => true,
      getScore: () => 0,
    },
    player_name: 'foo',
    player_color: 'blue',
    scores: [],
  };
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('trim-whitespace', {});
    localVue.directive('i18n', {});
    return localVue;
  }
  it('shows list and milestones', async function() {
    const milestone = mount(Milestone, {
      localVue: getLocalVue(),
      propsData: {
        milestones_list: [
          mockMilestone,
        ],
      },
    });
    const toggler = milestone.find('a[class="ma-clickable"]');
    await toggler.trigger('click');
    const test = milestone.find('div[class*="ma-name--milestones');
    expect(test.classes()).to.contain('ma-name');
    expect(test.classes()).to.contain('ma-name--test');
  });
});
