import {mount, VueWrapper} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import SortableCards from '@/client/components/SortableCards.vue';
import {CardOrderStorage} from '@/client/utils/CardOrderStorage';
import {FakeLocalStorage} from './FakeLocalStorage';

type DropSide = 'left' | 'right';

/**
 * Drag card at `sourceIndex` to `targetIndex` on its left or right side.
 */
async function dragCard(sortable: VueWrapper<InstanceType<typeof SortableCards>>, sourceIndex: number, targetIndex: number, position: DropSide) {
  const draggers = sortable.findAll('[draggable=true]');
  const target = draggers[targetIndex];

  // This test doesn't use a real layout, so cards aren't 200px wide. Here,
  // they're simulated at 10px. Positions 0-4 are the left side and positions
  // 5-9 are the right side.
  target.element.getBoundingClientRect = () => {
    return {left: 0, width: 10} as DOMRect;
  };

  await draggers[sourceIndex].trigger('dragstart');
  // 3 is the left side, 8 is the right side.
  await target.trigger('dragover', {clientX: position === 'left' ? 3 : 8});
  await draggers[sourceIndex].trigger('dragend');
}

/**
 * Returns the names of cards in this widget in their current order.
 */
function cardsInOrder(sortable: VueWrapper<InstanceType<typeof SortableCards>>): Array<CardName> {
  return sortable.findAllComponents({
    name: 'Card',
  }).map((card) => card.props().card.name);
}


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
        cards: [{name: CardName.ANTS}, {name: CardName.CARTEL}],
        playerId: 'player1',
      },
    });
    expect(cardsInOrder(sortable)).to.deep.eq([CardName.ANTS, CardName.CARTEL]);

    await dragCard(sortable, 0, 1, 'right');

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.CARTEL, CardName.ANTS]);
    expect(CardOrderStorage.getCardOrder('player1')).to.deep.eq({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
    });
  });

  it('puts new cards at end of order and removes old', async () => {
    CardOrderStorage.updateCardOrder('player1', {
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
      [CardName.DECOMPOSERS]: 3,
    });
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.ANTS}, {name: CardName.CARTEL}, {name: CardName.BIRDS}],
        playerId: 'player1',
      },
    });

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.CARTEL, CardName.ANTS, CardName.BIRDS]);

    await dragCard(sortable, 0, 2, 'left');

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.ANTS, CardName.CARTEL, CardName.BIRDS]);
    expect(CardOrderStorage.getCardOrder('player1')).to.deep.eq({
      [CardName.ANTS]: 1,
      [CardName.CARTEL]: 2,
      [CardName.BIRDS]: 3,
    });
  });

  it('sorts by cost', async () => {
    // Ants: 9, Cartel: 8, Birds: 10
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.ANTS}, {name: CardName.CARTEL}, {name: CardName.BIRDS}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'cost', reversed: false}});

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.CARTEL, CardName.ANTS, CardName.BIRDS]);
    expect(CardOrderStorage.getCardOrder('player1')).to.deep.eq({
      [CardName.CARTEL]: 1,
      [CardName.ANTS]: 2,
      [CardName.BIRDS]: 3,
    });
  });

  it('sorts in reverse', async () => {
    // Ants: 9, Cartel: 8, Birds: 10
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.ANTS}, {name: CardName.CARTEL}, {name: CardName.BIRDS}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'cost', reversed: true}});

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.BIRDS, CardName.ANTS, CardName.CARTEL]);
  });

  it('dragging a card clears the sort', async () => {
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.ANTS}, {name: CardName.CARTEL}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'cost', reversed: false}});
    await dragCard(sortable, 0, 1, 'right');

    expect(sortable.emitted('update:sortOrder')).to.deep.eq([[]]);
  });

  it('sorts by cost, preferring calculated cost', async () => {
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.ANTS}, {name: CardName.BIRDS, calculatedCost: 2}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'cost', reversed: false}});

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.BIRDS, CardName.ANTS]);
  });

  it('sorts by type', async () => {
    // Asteroid: event, Ants: active, Cartel: automated (8), Mine: automated (4)
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.ASTEROID}, {name: CardName.ANTS}, {name: CardName.CARTEL}, {name: CardName.MINE}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'type', reversed: false}});

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.MINE, CardName.CARTEL, CardName.ANTS, CardName.ASTEROID]);
  });

  it('sorts by type, corporations and preludes first', async () => {
    // Asteroid: event, Mine: automated, Donation: prelude, Ecoline: corporation
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.ASTEROID}, {name: CardName.MINE}, {name: CardName.DONATION}, {name: CardName.ECOLINE}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'type', reversed: false}});

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.ECOLINE, CardName.DONATION, CardName.MINE, CardName.ASTEROID]);
  });

  it('sorts by resource', async () => {
    // Cartel: none, Birds: animal, Ants: microbe (9), Tardigrades: microbe (4)
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.CARTEL}, {name: CardName.BIRDS}, {name: CardName.ANTS}, {name: CardName.TARDIGRADES}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'resource', reversed: false}});

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.BIRDS, CardName.TARDIGRADES, CardName.ANTS, CardName.CARTEL]);
  });

  it('sorts by vp', async () => {
    // Nuclear Zone: -2, Cartel: 0, Ants: variable, Asteroid Mining: 2
    const sortable = mount(SortableCards, {
      ...globalConfig,
      props: {
        cards: [{name: CardName.NUCLEAR_ZONE}, {name: CardName.CARTEL}, {name: CardName.ANTS}, {name: CardName.ASTEROID_MINING}],
        playerId: 'player1',
      },
    });

    await sortable.setProps({sortOrder: {key: 'vp', reversed: false}});

    expect(cardsInOrder(sortable)).to.deep.eq([CardName.ASTEROID_MINING, CardName.ANTS, CardName.CARTEL, CardName.NUCLEAR_ZONE]);
  });
});
