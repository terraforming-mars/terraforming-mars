import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Irrigator} from '../../src/server/milestones/Irrigator';
import {Player} from '../../src/server/Player';
import {maxOutOceans} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';

describe('Irrigator', () => {
  let milestone: Irrigator;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(() => {
    milestone = new Irrigator();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);

    maxOutOceans(player);
  });

  it('Can claim with 4 tiles adjacent to oceans', () => {
    game.addCityTile(player, '09');
    game.addGreenery(player, '20');
    game.addCityTile(player, '11');
    expect(milestone.canClaim(player)).is.false;

    game.addGreenery(player, '24');
    expect(milestone.canClaim(player)).is.true;
  });
});
