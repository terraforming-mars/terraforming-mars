import {expect} from 'chai';
import {FloaterUrbanism} from '../../../src/cards/pathfinders/FloaterUrbanism';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {TitanShuttles} from '../../../src/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/cards/pathfinders/MartianCulture';

describe('FloaterUrbanism', function() {
  let card: FloaterUrbanism;
  let player: TestPlayer;
  let game: Game;

  let floater1: IProjectCard;
  let floater2: IProjectCard;
  let other: IProjectCard;

  beforeEach(function() {
    card = new FloaterUrbanism();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    floater1 = new TitanShuttles();
    floater2 = new FloatingHabs();
    other = new MartianCulture();
    player.playedCards = [floater1, floater2, other];
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.tagsForTest = {venus: 3};
    expect(player.canPlay(card)).is.false;
    player.tagsForTest = {venus: 4};
    expect(player.canPlay(card)).is.true;
  });

  it('canAct', function() {
    other.resourceCount = 1;
    expect(card.canAct(player)).is.false;
    floater1.resourceCount = 1;
    expect(card.canAct(player)).is.true;
  });

  it('act - 1 card with floaters', function() {
    card.resourceCount = 0;
    floater1.resourceCount = 1;
    other.resourceCount = 1;

    card.action(player);

    expect(floater1.resourceCount).eq(0);
    expect(card.resourceCount).eq(1);
  });

  it('act - two cards with floaters', function() {
    card.resourceCount = 0;
    floater1.resourceCount = 1;
    floater2.resourceCount = 1;
    other.resourceCount = 1;

    const options = card.action(player)!;

    expect(options.cards.length).eq(2);
    options.cb([options.cards[0]]);
    expect(floater1.resourceCount).eq(0);
    expect(floater2.resourceCount).eq(1);
    expect(card.resourceCount).eq(1);

    options.cb([options.cards[1]]);
    expect(floater1.resourceCount).eq(0);
    expect(floater2.resourceCount).eq(0);
    expect(card.resourceCount).eq(2);
  });
});
