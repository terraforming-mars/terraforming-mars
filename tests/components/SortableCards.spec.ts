
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import {CardName} from '../../src/CardName';
import {SortableCards} from '../../src/components/SortableCards';

describe('SortableCards', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
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
  it('allows sorting after initial loading with no local storage', async function() {
    const sortable = mount(SortableCards, {
      localVue: getLocalVue(),
      propsData: {
        cards: [{
          name: CardName.ANTS,
        }, {
          name: CardName.CARTEL,
        }],
        playerId: 'foo',
      },
    });
    let cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards.length).to.eq(2);
    expect(cards.at(0).props().card.name).to.eq(CardName.ANTS);
    expect(cards.at(1).props().card.name).to.eq(CardName.CARTEL);
    const draggers = sortable.findAllComponents({
      ref: 'cardbox',
    });
    await draggers.at(0).trigger('dragstart');
    await draggers.at(1).trigger('dragover');
    await draggers.at(0).trigger('dragend');
    cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards.at(0).props().card.name).to.eq(CardName.CARTEL);
    expect(cards.at(1).props().card.name).to.eq(CardName.ANTS);
    expect(expectedStorage['cardOrderfoo']).not.to.be.undefined;
    expect(JSON.parse(expectedStorage['cardOrderfoo'])).to.deep.eq({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
    });
  });
  it('puts new cards at end of order and removes old', async function() {
    expectedStorage['cardOrderfoo'] = JSON.stringify({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
      [CardName.DECOMPOSERS]: 3,
    });
    const sortable = mount(SortableCards, {
      localVue: getLocalVue(),
      propsData: {
        cards: [{
          name: CardName.ANTS,
        }, {
          name: CardName.CARTEL,
        }, {
          name: CardName.BIRDS,
        }],
        playerId: 'foo',
      },
    });
    let cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards.length).to.eq(3);
    expect(cards.at(0).props().card.name).to.eq(CardName.CARTEL);
    expect(cards.at(1).props().card.name).to.eq(CardName.ANTS);
    expect(cards.at(2).props().card.name).to.eq(CardName.BIRDS);
    const draggers = sortable.findAllComponents({
      ref: 'cardbox',
    });
    await draggers.at(0).trigger('dragstart');
    await draggers.at(1).trigger('dragover');
    await draggers.at(0).trigger('dragend');
    cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards.at(0).props().card.name).to.eq(CardName.ANTS);
    expect(cards.at(1).props().card.name).to.eq(CardName.CARTEL);
    expect(cards.at(2).props().card.name).to.eq(CardName.BIRDS);
    expect(expectedStorage['cardOrderfoo']).not.to.be.undefined;
    expect(JSON.parse(expectedStorage['cardOrderfoo'])).to.deep.eq({
      [CardName.ANTS]: 1,
      [CardName.CARTEL]: 2,
      [CardName.BIRDS]: 3,
    });
  });
});
