import {expect} from 'chai';
import {ArboristCollective} from '../../../src/server/cards/underworld/ArboristCollective';
import {testGame} from '../../TestGame';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';

describe('ArboristCollective', () => {
  let card: ArboristCollective;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new ArboristCollective();
    [game, player] = testGame(1);
  });

  it('Should play', () => {
    player.playCorporationCard(card);
    runAllActions(game);

    expect(player.stock.plants).eq(3);
    expect(player.production.plants).eq(1);
  });

  it('canAct', () => {
    card.resourceCount = 1;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 2;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.corporations.push(card);

    card.resourceCount = 3;

    cast(card.action(player), undefined);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
    expect(player.stock.plants).eq(2);
    expect(player.production.plants).eq(1);
  });

  it('onCardPlayed', () => {
    player.corporations.push(card);

    expect(card.resourceCount).eq(0);

    // Card is too expensive
    card.onCardPlayed(player, fakeCard({type: CardType.EVENT, cost: 15}));
    expect(card.resourceCount).eq(0);

    // Card is not an event
    card.onCardPlayed(player, fakeCard({type: CardType.ACTIVE, cost: 14}));
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, fakeCard({type: CardType.EVENT, cost: 14}));
    expect(card.resourceCount).eq(1);
  });
});
