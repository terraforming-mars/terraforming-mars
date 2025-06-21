import {expect} from 'chai';
import {AresHandler} from '../../../src/server/ares/AresHandler';
import {SolarFarm} from '../../../src/server/cards/ares/SolarFarm';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('SolarFarm', () => {
  let card: SolarFarm;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new SolarFarm();
    [game, player] = testGame(2, {aresExtension: true, aresHazards: true});
  });

  it('Play', () => {
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

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpcae = cast(player.popWaitingFor(), SelectSpace);

    expect(player.production.energy).eq(0);

    const citySpace = game.board.getAvailableSpacesOnLand(player).filter((s) => !AresHandler.hasHazardTile(s))[0];
    selectSpcae.cb(citySpace);

    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile!.tileType).to.eq(TileType.SOLAR_FARM);
    expect(citySpace.adjacency).to.deep.eq({
      bonus: [SpaceBonus.ENERGY, SpaceBonus.ENERGY],
    });
    expect(player.production.energy).eq(7);
  });
});
