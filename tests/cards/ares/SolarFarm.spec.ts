import {expect} from 'chai';
import {AresHandler} from '../../../src/server/ares/AresHandler';
import {SolarFarm} from '../../../src/server/cards/ares/SolarFarm';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Space} from '../../../src/server/boards/Space';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {cast} from '../../../src/common/utils/utils';

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

  describe('on Amazonis Planitia', () => {
    beforeEach(() => {
      [game, player] = testGame(2, {boardName: BoardName.AMAZONIS_PLANITIA, aresExtension: true, aresHazards: false});
      player.playedCards.push(card);
    });

    function placeSolarFarmOn(space: Space) {
      card.play(player);
      runAllActions(game);
      cast(player.popWaitingFor(), SelectSpace).cb(space);
      runAllActions(game);
    }

    function standardResourceSpace(): Space {
      return game.board.spaces.find((s) => s.spaceType === SpaceType.LAND && s.bonus.includes(SpaceBonus.STANDARD_RESOURCE))!;
    }

    it('counts a wild bonus chosen as plants', () => {
      placeSolarFarmOn(standardResourceSpace());
      cast(player.popWaitingFor(), SelectResource).cb('plants');
      runAllActions(game);

      expect(player.production.energy).eq(1);
      expect(player.stock.plants).eq(1);
    });

    it('does not count a wild bonus chosen as steel', () => {
      placeSolarFarmOn(standardResourceSpace());
      cast(player.popWaitingFor(), SelectResource).cb('steel');
      runAllActions(game);

      expect(player.production.energy).eq(0);
      expect(player.stock.steel).eq(1);
    });

    it('counts printed plants on an Amazonis space', () => {
      const space = game.board.spaces.find((s) => s.spaceType === SpaceType.LAND && s.bonus.filter((b) => b === SpaceBonus.PLANT).length === 2)!;
      placeSolarFarmOn(space);

      expect(player.popWaitingFor()).is.undefined;
      expect(player.production.energy).eq(2);
    });
  });
});
