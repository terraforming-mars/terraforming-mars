import {mount, VueWrapper} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import SortableCards from '@/client/components/SortableCards.vue';
import {FakeLocalStorage} from './FakeLocalStorage';
import {PlayerId} from '@/common/Types';

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

/**
 * Returns the entries in local storage for the given player.
 */
function getStorageEntries(playerId: PlayerId): {[key in CardName]?: number} {
  const entries: {[key in CardName]?: number} = {};
  const item = localStorage.getItem(`cardOrder${playerId}`);
  if (item) {
    const parsed = JSON.parse(item);
    for (const [cardName, order] of Object.entries(parsed)) {
      entries[cardName as CardName] = order as number;
    }
  }
  return entries;
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
    expect(getStorageEntries('player1')).to.deep.eq({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
    });
  });

  it('puts new cards at end of order and removes old', async () => {
    localStorage.setItem('cardOrderplayer1', JSON.stringify({
      [CardName.ANTS]: 2,
      [CardName.CARTEL]: 1,
      [CardName.DECOMPOSERS]: 3,
    }));
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
    expect(getStorageEntries('player1')).to.deep.eq({
      [CardName.ANTS]: 1,
      [CardName.CARTEL]: 2,
      [CardName.BIRDS]: 3,
    });
  });
});
