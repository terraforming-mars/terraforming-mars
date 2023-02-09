import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Irrigator} from '../../src/server/milestones/Irrigator';
import {addCityTile, addGreenery, maxOutOceans} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';

describe('Irrigator', () => {
  let milestone: Irrigator;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    milestone = new Irrigator();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);

    maxOutOceans(player);
  });

  it('Can claim with 4 tiles adjacent to oceans', () => {
    addCityTile(player, '09');
    addGreenery(player, '20');
    addCityTile(player, '11');
    expect(milestone.canClaim(player)).is.false;

    addGreenery(player, '24');
    expect(milestone.canClaim(player)).is.true;
  });
});
