import {expect} from 'chai';
import {AresHandler} from '../../../src/server/ares/AresHandler';
import {SolarFarm} from '../../../src/server/cards/ares/SolarFarm';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {ARES_OPTIONS_WITH_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('SolarFarm', function() {
  let card: SolarFarm;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SolarFarm();
    [game, player] = testGame(2, ARES_OPTIONS_WITH_HAZARDS);
  });

  it('Play', function() {
    // Find the first spot with no hazard tile on it to place a city.
    const space = game.board.getAvailableSpacesForCity(player).filter((s) => !AresHandler.hasHazardTile(s))[0];
    // Hack the space to have a large number of plants, just to show a matching
    // energy production bump - seven.
    space.bonus = [
      SpaceBonus.PLANT,
      SpaceBonus.PLANT,
      SpaceBonus.PLANT,
      SpaceBonus.PLANT,
      SpaceBonus.PLANT,
      SpaceBonus.PLANT,
      SpaceBonus.PLANT,
    ];

    const action = cast(card.play(player), SelectSpace);
    expect(player.production.energy).eq(0);
    const citySpace = game.board.getAvailableSpacesOnLand(player).filter((s) => !AresHandler.hasHazardTile(s))[0];
    action.cb(citySpace);
    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile!.tileType).to.eq(TileType.SOLAR_FARM);
    expect(citySpace.adjacency).to.deep.eq({
      bonus: [SpaceBonus.ENERGY, SpaceBonus.ENERGY],
    });
    expect(player.production.energy).eq(7);
  });
});
