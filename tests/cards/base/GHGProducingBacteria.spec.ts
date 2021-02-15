import {expect} from 'chai';
import {GHGProducingBacteria} from '../../../src/cards/base/GHGProducingBacteria';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('GHGProducingBacteria', function() {
  let card : GHGProducingBacteria; let player : Player; let game : Game;

  beforeEach(function() {
    card = new GHGProducingBacteria();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).oxygenLevel = 4;
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);

    card.action(player);
    expect(card.resourceCount).to.eq(1);

    card.action(player);
    expect(card.resourceCount).to.eq(2);

    const orAction = card.action(player) as OrOptions;
    expect(orAction instanceof OrOptions).is.true;

        orAction!.options[1].cb();
        expect(card.resourceCount).to.eq(3);

        orAction!.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(game.getTemperature()).to.eq(-28);
  });
});
