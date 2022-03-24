import {expect} from 'chai';
import {MiningGuild} from '../../../src/cards/corporation/MiningGuild';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Phase} from '../../../src/common/Phase';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {BoardType} from '../../../src/boards/BoardType';
import {TileType} from '../../../src/common/TileType';
import {OceanCity} from '../../../src/cards/ares/OceanCity';

describe('MiningGuild', () => {
  let card : MiningGuild; let player : Player; let player2 : Player; let game: Game;

  beforeEach(() => {
    card = new MiningGuild();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions({
      aresExtension: true,
      aresHazards: false,
    }));

    player.corporationCard = card;
  });

  it('Should play', () => {
    card.play(player);
    expect(player.steel).to.eq(5);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });

  it('Gives steel production bonus when placing tiles', () => {
    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: []}, BoardType.MARS);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);

    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.STEEL, SpaceBonus.TITANIUM]}, BoardType.MARS);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);

    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.STEEL]}, BoardType.MARS);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);

    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.TITANIUM]}, BoardType.MARS);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(3);
  });

  it('Gives steel production bonus when placing ocean tile', () => {
    game.board.getSpaces(SpaceType.OCEAN, player).forEach((space) => {
      if (space.bonus.includes(SpaceBonus.TITANIUM) || space.bonus.includes(SpaceBonus.STEEL)) {
        game.addOceanTile(player, space.id);
      }
    });
    // There are two spaces on the main board that grant titanium or steel.
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });

  it('Does not give bonus when other players place tiles', () => {
    card.onTilePlaced(player, player2, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.TITANIUM]}, BoardType.MARS);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Does not give bonus when other players place ocean tiles', () => {
    TestingUtils.maxOutOceans(player2); // 1 ocean with titanium and 1 with steel
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Does not give bonus for WGT', () => {
    game.phase = Phase.SOLAR;
    TestingUtils.maxOutOceans(player); // 1 ocean with titanium and 1 with steel
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Does not give bonus when overplacing', () => {
    const space = game.board.getSpaces(SpaceType.OCEAN, player).find((space) => space.bonus.includes(SpaceBonus.STEEL))!;
    game.addOceanTile(player, space.id);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);

    const oceanCity = new OceanCity();
    const selectSpace = oceanCity.play(player);
    selectSpace.cb(space);

    expect(space.tile?.tileType).equal(TileType.OCEAN_CITY);
    TestingUtils.runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
