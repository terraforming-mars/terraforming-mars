import {expect} from 'chai';
import {DesertSettler} from '../../src/server/awards/DesertSettler';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TileType} from '../../src/common/TileType';
import {TestPlayer} from '../TestPlayer';
import {ARES_OPTIONS_NO_HAZARDS} from './AresTestHelper';
import {addOcean} from '../TestingUtils';

describe('OtherAresTests', function() {
  let player: Player;
  let otherPlayer: Player;
  let game: Game;

  it('Desert settler counts upgraded oceans', function() {
    player = TestPlayer.BLUE.newPlayer();
    otherPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);

    const oceanSpace = game.board.getAvailableSpacesForOcean(player).filter((s) => s.y >= 5)[0];
    game.addOceanTile(player, oceanSpace.id);
    for (let n = 0; n < 8; n++) {
      addOcean(player);
    }

    const award = new DesertSettler();
    expect(award.getScore(player)).eq(0);

    game.addTile(player, SpaceType.OCEAN, oceanSpace, {tileType: TileType.OCEAN_CITY});

    expect(award.getScore(player)).eq(1);
  });
});
