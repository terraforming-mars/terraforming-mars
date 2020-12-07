
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import {CardName} from '../../src/CardName';
import {SelectHowToPayForCard} from '../../src/components/SelectHowToPayForCard';

describe('SelectHowToPayForCard', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    localVue.directive('trim-whitespace', {});
    return localVue;
  }
  let expectedStorage: {[x: string]: string} = {};
  before(function() {
    (global as any).localStorage = {
      getItem: function(key: string) {
        if (expectedStorage[key] === undefined) {
          return null;
        }
        return expectedStorage[key];
      },
      setItem: function(key: string, value: string) {
        expectedStorage[key] = value;
      },
    };
  });
  after(function() {
    (global as any).localStorage = undefined;
  });
  beforeEach(function() {
    expectedStorage = {};
  });
  it('uses sort order for cards', async function() {
    expectedStorage['cardOrderfoo'] = JSON.stringify({
      [CardName.ANTS]: 2,
      [CardName.BIRDS]: 1,
    });
    const sortable = mount(SelectHowToPayForCard, {
      localVue: getLocalVue(),
      propsData: {
        player: {
          cardsInHand: [{
            calculatedCost: 4,
            name: CardName.ANTS,
          }, {
            calculatedCost: 3,
            name: CardName.BIRDS,
          }],
          id: 'foo',
          selfReplicatingRobotCards: [],
        },
        playerinput: {
          title: 'foo',
          cards: [{
            name: CardName.ANTS,
          }, {
            name: CardName.BIRDS,
          }],
        },
        onsave: function() {},
        showsave: true,
        showtitle: true,
      },
    });
    const cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards.length).to.eq(2);
    expect(cards.at(0).props().card.name).to.eq(CardName.BIRDS);
    expect(cards.at(1).props().card.name).to.eq(CardName.ANTS);
  });
});
