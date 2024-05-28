import {expect} from 'chai';
import {cardAction, cast, runAllActions} from '../../TestingUtils';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('RegolithEaters', function() {
  let card: RegolithEaters;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new RegolithEaters();
    [game, player] = testGame(2);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(cardAction(card, player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    expect(cardAction(card, player)).is.undefined;
    expect(card.resourceCount).to.eq(2);

    const orOptions = cast(cardAction(card, player), OrOptions);

    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(3);

    orOptions.options[0].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
