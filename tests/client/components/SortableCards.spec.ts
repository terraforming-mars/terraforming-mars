import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import SortableCards from '@/client/components/SortableCards.vue';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('SortableCards', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });
  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('allows sorting after initial loading with no local storage', async () => {
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
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
    expect(cards).has.length(2);
    expect(cards[0].props().card.name).to.eq(CardName.ANTS);
    expect(cards[1].props().card.name).to.eq(CardName.CARTEL);
    const draggers = sortable.findAll('[draggable=true]');
    await draggers[1].trigger('dragstart');
    await sortable.vm.$nextTick();
    const droppers = sortable.findAll('.drop-target');
    await droppers[0].trigger('dragover');
    await draggers[1].trigger('dragend');
    cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards[0].props().card.name).to.eq(CardName.CARTEL);
    expect(cards[1].props().card.name).to.eq(CardName.ANTS);
    const order = localStorage.getItem('cardOrderfoo');
    expect(order).not.to.be.undefined;
    expect(JSON.parse(order!)).to.deep.eq({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
    });
  });
  it('puts new cards at end of order and removes old', async () => {
    localStorage.setItem('cardOrderfoo', JSON.stringify({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
      [CardName.DECOMPOSERS]: 3,
    }));
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
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
    expect(cards).has.length(3);
    expect(cards[0].props().card.name).to.eq(CardName.CARTEL);
    expect(cards[1].props().card.name).to.eq(CardName.ANTS);
    expect(cards[2].props().card.name).to.eq(CardName.BIRDS);
    const draggers = sortable.findAll('[draggable=true]');
    await draggers[0].trigger('dragstart');
    await sortable.vm.$nextTick();
    const droppers = sortable.findAll('.drop-target');
    await droppers[2].trigger('dragover');
    await draggers[0].trigger('dragend');
    cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards[0].props().card.name).to.eq(CardName.ANTS);
    expect(cards[1].props().card.name).to.eq(CardName.CARTEL);
    expect(cards[2].props().card.name).to.eq(CardName.BIRDS);
    const order = localStorage.getItem('cardOrderfoo');
    expect(order).not.to.be.undefined;
    expect(JSON.parse(order!)).to.deep.eq({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 3,
      [CardName.BIRDS]: 4,
    });
  });
});
