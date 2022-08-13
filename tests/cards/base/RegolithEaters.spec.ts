import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('RegolithEaters', function() {
  let card: RegolithEaters;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new RegolithEaters();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    expect(card.resourceCount).to.eq(2);
    const orOptions = cast(card.action(player), OrOptions);

    orOptions.options[1].cb();
    expect(card.resourceCount).to.eq(3);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
