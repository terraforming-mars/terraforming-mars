import {expect} from 'chai';
import {FloaterUrbanism} from '../../../src/server/cards/pathfinders/FloaterUrbanism';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {cast} from '@/common/utils/utils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {churn, runAllActions} from '../../TestingUtils';

describe('FloaterUrbanism', () => {
  let card: FloaterUrbanism;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  let floater1: IProjectCard;
  let floater2: IProjectCard;
  let other: IProjectCard;

  beforeEach(() => {
    card = new FloaterUrbanism();
    [game, player, player2] = testGame(2);
    floater1 = new TitanShuttles();
    floater2 = new FloatingHabs();
    other = new MartianCulture();
    player.playedCards.push(floater1, floater2, other);
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    player.tagsForTest = {venus: 3};
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {venus: 4};
    expect(player.canPlay(card)).is.true;
  });

  it('canAct', () => {
    other.resourceCount = 1;
    expect(card.canAct(player)).is.false;
    floater1.resourceCount = 1;
    expect(card.canAct(player)).is.true;
  });

  it('act - 1 card with floaters', () => {
    card.resourceCount = 0;
    floater1.resourceCount = 1;
    other.resourceCount = 1;

    card.action(player);
    runAllActions(game);

    expect(floater1.resourceCount).eq(0);
    expect(card.resourceCount).eq(1);
  });

  it('act - two cards with floaters', () => {
    card.resourceCount = 0;
    floater1.resourceCount = 1;
    floater2.resourceCount = 1;
    other.resourceCount = 1;

    const options = cast(churn(card.action(player), player), SelectCard);
    expect(options.cards).has.length(2);
    options.cb([options.cards[0]]);
    runAllActions(game);
    expect(floater1.resourceCount).eq(0);
    expect(floater2.resourceCount).eq(1);
    expect(card.resourceCount).eq(1);

    options.cb([options.cards[1]]);
    runAllActions(game);
    expect(floater1.resourceCount).eq(0);
    expect(floater2.resourceCount).eq(0);
    expect(card.resourceCount).eq(2);
  });

  it('act - cannot take a floater from an opponent\'s card', () => {
    const opponentFloaters = new TitanShuttles();
    player2.playedCards.push(opponentFloaters);
    opponentFloaters.resourceCount = 1;
    floater1.resourceCount = 1;

    card.action(player);
    runAllActions(game);

    expect(opponentFloaters.resourceCount).eq(1);
    expect(floater1.resourceCount).eq(0);
    expect(card.resourceCount).eq(1);
  });
});
