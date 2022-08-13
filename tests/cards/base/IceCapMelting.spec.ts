import {expect} from 'chai';
import {IceCapMelting} from '../../../src/server/cards/base/IceCapMelting';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('IceCapMelting', function() {
  let card: IceCapMelting;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new IceCapMelting();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 2;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
  });
});
