import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {OceanFarm} from '../../../src/cards/ares/OceanFarm';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {Resources} from '../../../src/common/Resources';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('OceanFarm', () => {
  let card : OceanFarm; let player : Player; let otherPlayer: Player; let game : Game;

  beforeEach(() => {
    card = new OceanFarm();
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Can play', () => {
    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Play', () => {
    expect(player.getProduction(Resources.HEAT)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(0);

    const oceanSpace = TestingUtils.addOcean(player);
    const action = card.play(player);

    expect(player.getProduction(Resources.HEAT)).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_FARM);
    expect(oceanSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT]});
  });

  it('Ocean Farm counts as ocean for adjacency', () => {
    const oceanSpace = TestingUtils.addOcean(player);
    const action = card.play(player);
    action.cb(oceanSpace);
    const greenery = game.board.getAdjacentSpaces(oceanSpace).filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(otherPlayer.megaCredits).eq(0);

    game.addGreenery(otherPlayer, greenery.id);

    expect(otherPlayer.megaCredits).eq(2);
  });

  it('Placing Ocean Farm does not grant underlying space bonus', () => {
    const oceanSpace = game.board.spaces.filter((space) => {
      return space.bonus.length === 1 && space.bonus[0] === SpaceBonus.PLANT && space.spaceType === SpaceType.OCEAN;
    })[0];

    player.plants = 0;
    game.addOceanTile(player, oceanSpace.id);
    expect(player.plants).eq(1);

    const action = card.play(player);

    expect(player.plants).eq(1);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_FARM);
    expect(player.plants).eq(1);
  });
});
