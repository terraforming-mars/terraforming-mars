
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';

import {expect} from 'chai';
import Milestone from '@/client/components/Milestone.vue';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';

describe('Milestone', function() {
  const mockMilestone: ClaimedMilestoneModel = {
    name: 'test',
    description: 'a test',
    player_name: 'foo',
    player_color: 'blue',
    scores: [],
  };

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
