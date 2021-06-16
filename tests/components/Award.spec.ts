
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import Award from '../../src/components/Award.vue';
import {FundedAwardModel} from '../../src/models/FundedAwardModel';

describe('Award', function() {
  const mockAward: FundedAwardModel = {
    award: {
      name: 'test',
      description: 'a test',
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
  it('shows list and award', async function() {
    const award = mount(Award, {
      localVue: getLocalVue(),
      propsData: {
        awards_list: [
          mockAward,
        ],
      },
    });
    const toggler = award.find('a[class="ma-clickable awards-padding"]');
    await toggler.trigger('click');
    const test = award.find('div[class*="ma-name--awards"]');
    expect(test.classes()).to.contain('ma-name');
    expect(test.classes()).to.contain('ma-name--test');
  });
});
