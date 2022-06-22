import {expect} from 'chai';
import {IceCapMelting} from '../../../src/cards/base/IceCapMelting';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('IceCapMelting', function() {
  let card : IceCapMelting; let player : Player; let game : Game;

  beforeEach(function() {
    card = new IceCapMelting();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 2;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
  });
});
