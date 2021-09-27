import {expect} from 'chai';
import {DesertSettler} from '../../src/awards/DesertSettler';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {SpaceType} from '../../src/SpaceType';
import {TileType} from '../../src/TileType';
import {TestPlayers} from '../TestPlayers';
import {ARES_OPTIONS_NO_HAZARDS} from './AresTestHelper';
import {TestingUtils} from '../TestingUtils';

describe('OtherAresTests', function() {
  let player : Player;
  let otherPlayer: Player;
  let game : Game;

  it('Desert settler counts upgraded oceans', function() {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);

    const oceanSpace = game.board.getAvailableSpacesForOcean(player).filter((s) => s.y >= 5)[0];
    game.addOceanTile(player, oceanSpace.id);
    for (let n = 0; n < 8; n++) {
      TestingUtils.addOcean(player);
    }

    const award = new DesertSettler();
    expect(award.getScore(player)).eq(0);

    game.addTile(player, SpaceType.OCEAN, oceanSpace, {tileType: TileType.OCEAN_CITY});

    expect(award.getScore(player)).eq(1);
  });
});
