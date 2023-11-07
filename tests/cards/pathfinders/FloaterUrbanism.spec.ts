import {expect} from 'chai';
import {FloaterUrbanism} from '../../../src/server/cards/pathfinders/FloaterUrbanism';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {FloatingHabs} from '../../../src/server/cards/venusNext/FloatingHabs';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';
import {cast} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('FloaterUrbanism', function() {
  let card: FloaterUrbanism;
  let player: TestPlayer;

  let floater1: IProjectCard;
  let floater2: IProjectCard;
  let other: IProjectCard;

  beforeEach(function() {
    card = new FloaterUrbanism();
    [/* game */, player] = testGame(1);
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

    const options = cast(card.action(player), SelectCard);
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
