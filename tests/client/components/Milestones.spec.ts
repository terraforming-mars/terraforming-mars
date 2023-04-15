import {expect} from 'chai';
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import Milestones from '@/client/components/Milestones.vue';
import {ClaimedMilestoneModel} from '@/common/models/ClaimedMilestoneModel';
import Milestone from '@/client/components/Milestone.vue';
import {Preferences} from '@/client/utils/PreferencesManager';

describe('Milestones', function() {
  const mockMilestone: ClaimedMilestoneModel = {
    name: 'Farmer',
    playerName: 'foo',
    playerColor: 'blue',
    scores: [],
  };

  it('shows list and milestones', async function() {
    const milestone = mount(Milestones, {
      localVue: getLocalVue(),
      propsData: {
        milestones: [
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

  it('milestones show details if previously set to show details', async () => {
    const milestone = mount(Milestones, {
      localVue: getLocalVue(),
      propsData: {
        milestones: [
          mockMilestone,
        ],
        preferences: {
          show_milestone_details: true,
        } as Readonly<Preferences>,
      },
    });


    expect(
      milestone.findAllComponents(Milestone).wrappers.every((milestoneWrapper) => milestoneWrapper.isVisible()),
    ).to.be.true;
  });

  it('milestones hide details if previously set to hide details', async () => {
    const milestone = mount(Milestones, {
      localVue: getLocalVue(),
      propsData: {
        milestones: [
          mockMilestone,
        ],
        preferences: {
          show_milestone_details: false,
        } as Readonly<Preferences>,
      },
    });

    console.error(milestone.findAllComponents(Milestone).wrappers[0].isVisible());
    expect(
      milestone.findAllComponents(Milestone).wrappers.every((milestoneWrapper) => !milestoneWrapper.isVisible()),
    ).to.be.true;
  });
});
