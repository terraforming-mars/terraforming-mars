import {expect} from 'chai';
import {RegolithEaters} from '../../../src/cards/base/RegolithEaters';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('RegolithEaters', function() {
  let card : RegolithEaters; let player : Player; let game : Game;

  beforeEach(function() {
    card = new RegolithEaters();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    expect(card.resourceCount).to.eq(2);
    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;

        orOptions!.options[1].cb();
        expect(card.resourceCount).to.eq(3);

        orOptions!.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(1);
  });
});
