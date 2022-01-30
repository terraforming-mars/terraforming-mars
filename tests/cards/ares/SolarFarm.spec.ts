import {expect} from 'chai';
import {AresHandler} from '../../../src/ares/AresHandler';
import {SolarFarm} from '../../../src/cards/ares/SolarFarm';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {ARES_OPTIONS_WITH_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('SolarFarm', function() {
  let card: SolarFarm; let player: Player; let game: Game;

  beforeEach(function() {
    card = new SolarFarm();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
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

    const action = card.play(player);

    expect(action).instanceOf(SelectSpace);

    expect(player.getProduction(Resources.ENERGY)).eq(0);
    const citySpace = game.board.getAvailableSpacesOnLand(player).filter((s) => !AresHandler.hasHazardTile(s))[0];
    action.cb(citySpace);
    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile!.tileType).to.eq(TileType.SOLAR_FARM);
    expect(citySpace.adjacency).to.deep.eq({
      bonus: [SpaceBonus.POWER, SpaceBonus.POWER],
    });
    expect(player.getProduction(Resources.ENERGY)).eq(7);
  });
});
