import {expect} from 'chai';
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import Milestones from '@/client/components/Milestones.vue';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';

describe('Milestones', function() {
  const mockMilestone: ClaimedMilestoneModel = {
    name: 'Farmer',
    player_name: 'foo',
    player_color: 'blue',
    scores: [],
  };

  it('shows list and milestones', async function() {
    const milestone = mount(Milestones, {
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
    console.log(test.classes());
    expect(test.classes()).to.contain('ma-name');
    expect(test.classes()).to.contain('ma-name--farmer');
  });
});
