import {IGame} from '../../../src/server/IGame';
import {OceanFarm} from '../../../src/server/cards/ares/OceanFarm';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayer} from '../../TestPlayer';
import {addOcean, cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('OceanFarm', () => {
  let card: OceanFarm;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new OceanFarm();
    [game, player, otherPlayer] = testGame(2, {aresExtension: true});
  });

  it('Can play', () => {
    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.true;
  });

  it('Play', () => {
    expect(player.production.heat).eq(0);
    expect(player.production.plants).eq(0);

    const oceanSpace = addOcean(player);
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    expect(player.production.heat).eq(1);
    expect(player.production.plants).eq(1);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_FARM);
    expect(oceanSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT]});
  });

  it('Ocean Farm counts as ocean for adjacency', () => {
    const oceanSpace = addOcean(player);
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(oceanSpace);
    const greenery = game.board.getAdjacentSpaces(oceanSpace).filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(otherPlayer.megaCredits).eq(0);

    game.addGreenery(otherPlayer, greenery);

    expect(otherPlayer.megaCredits).eq(2);
  });

  it('Placing Ocean Farm does not grant underlying space bonus', () => {
    const oceanSpace = game.board.spaces.filter((space) => {
      return space.bonus.length === 1 && space.bonus[0] === SpaceBonus.PLANT && space.spaceType === SpaceType.OCEAN;
    })[0];

    player.plants = 0;
    game.addOcean(player, oceanSpace);
    expect(player.plants).eq(1);

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    expect(player.plants).eq(1);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_FARM);
    expect(player.plants).eq(1);
  });
});
