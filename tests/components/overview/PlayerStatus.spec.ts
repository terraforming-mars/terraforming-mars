
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import {PlayerStatus} from '../../../src/components/overview/Playerstatus';

describe('PlayerStatus', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    return localVue;
  }
  it('includes corporation cards with played card count', function() {
    const playerStatus = mount(PlayerStatus, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: function() {},
        },
      },
      propsData: {
        activePlayer: {
          id: 'foobar',
        },
        player: {
          corporationCard: {},
          id: 'foobar',
          playedCards: [],
        },
      },
    });
    const test = playerStatus.find('div[class*="played-cards-count"]');
    expect(test.text()).to.eq('1');
  });
});
