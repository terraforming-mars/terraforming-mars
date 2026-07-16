import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {GHGProducingBacteria} from '../../src/server/cards/base/GHGProducingBacteria';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {AddResourcesToCard} from '../../src/server/deferredActions/AddResourcesToCard';
import {TestPlayer} from '../TestPlayer';
import {CardResource} from '../../src/common/CardResource';
import {cast, testGame} from '../TestingUtils';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {SelfReplicatingRobots} from '../../src/server/cards/promo/SelfReplicatingRobots';

describe('AddResourcesToCard', () => {
  let player: TestPlayer;
  let ghgProducingBacteria: GHGProducingBacteria;
  let tardigrades: Tardigrades;
  let ants: Ants;
  let selfReplicatingRobots: SelfReplicatingRobots;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    ghgProducingBacteria = new GHGProducingBacteria();
    tardigrades = new Tardigrades();
    ants = new Ants();
    selfReplicatingRobots = new SelfReplicatingRobots();
  });

  it('0 cards in hand no action', () => {
    const action = new AddResourcesToCard(player, CardResource.MICROBE, {count: 5});
    expect(action.execute()).is.undefined;
  });

  it('0 resources no action', () => {
    player.playedCards.push(ghgProducingBacteria);
    const action = new AddResourcesToCard(player, CardResource.MICROBE, {count: 0});
    expect(action.execute()).is.undefined;
  });

  it('one card autofill', () => {
    player.playedCards.push(ghgProducingBacteria);
    const selectCard = new AddResourcesToCard(player, CardResource.MICROBE, {count: 5}).execute();
    expect(selectCard).is.undefined;
    expect(ghgProducingBacteria.resourceCount).eq(5);
  });

  it('many microbe cards', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    const selectCard = cast(new AddResourcesToCard(player, CardResource.MICROBE).execute(), SelectCard);

    expect(selectCard.cards).has.length(3);
    selectCard.cb([ghgProducingBacteria]);

    expect(ghgProducingBacteria.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(0);
    expect(ants.resourceCount).eq(0);
  });

  it('many microbe cards', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    const selectCard = cast(new AddResourcesToCard(player, CardResource.MICROBE).execute(), SelectCard);

    expect(selectCard.cards).has.length(3);
    selectCard.cb([ghgProducingBacteria]);

    expect(ghgProducingBacteria.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(0);
    expect(ants.resourceCount).eq(0);
  });

  it('works with self-replicating robots', () => {
    player.playedCards.push(ghgProducingBacteria, selfReplicatingRobots);
    selfReplicatingRobots.targetCards = [tardigrades];

    const selectCard = cast(new AddResourcesToCard(player, CardResource.MICROBE).execute(), SelectCard);

    expect(selectCard.cards).has.length(2);
    expect(selectCard.cards[0]).eq(ghgProducingBacteria);
    expect(selectCard.cards[1]).eq(tardigrades);

    selectCard.cb([tardigrades]);

    expect(tardigrades.resourceCount).eq(1);
  });

  it('filter works with self-replicating robots', () => {
    player.playedCards.push(ghgProducingBacteria, ants, selfReplicatingRobots);
    selfReplicatingRobots.targetCards = [tardigrades];

    const selectCard = cast(new AddResourcesToCard(player, CardResource.MICROBE, {filter: (c) => c.name.endsWith('s')}).execute(), SelectCard);
    expect(selectCard.cards).has.length(2);
    expect(selectCard.cards[0]).eq(ants);
    expect(selectCard.cards[1]).eq(tardigrades);
    selectCard.cb([tardigrades]);

    expect(tardigrades.resourceCount).eq(1);
  });
});
