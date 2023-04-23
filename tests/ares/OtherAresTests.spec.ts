import {expect} from 'chai';
import {DesertSettler} from '../../src/server/awards/DesertSettler';
import {Game} from '../../src/server/Game';
import {TileType} from '../../src/common/TileType';
import {TestPlayer} from '../TestPlayer';
import {addOcean} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('OtherAresTests', function() {
  let player: TestPlayer;
  let game: Game;

  it('Desert settler counts upgraded oceans', function() {
    [game, player] = testGame(2, {aresExtension: true});

    const oceanSpace = game.board.getAvailableSpacesForOcean(player).filter((s) => s.y >= 5)[0];
    game.addOceanTile(player, oceanSpace);
    for (let n = 0; n < 8; n++) {
      addOcean(player);
    }

    const award = new DesertSettler();
    expect(award.getScore(player)).eq(0);

    game.addTile(player, oceanSpace, {tileType: TileType.OCEAN_CITY});

    expect(award.getScore(player)).eq(1);
  });
});
