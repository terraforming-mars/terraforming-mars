import {expect} from 'chai';
import {cardAction, cast, runAllActions} from '../../TestingUtils';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('RegolithEaters', function() {
  let card: RegolithEaters;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RegolithEaters();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    player.popSelectInitialCards();
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
