import {expect} from 'chai';
import {OceanSanctuary} from '../../../src/cards/ares/OceanSanctuary';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('OceanSanctuary', function() {
  let card : OceanSanctuary; let player : Player; let otherPlayer: Player; let game : Game;

  beforeEach(function() {
    card = new OceanSanctuary();
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Can play', function() {
    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addOcean(player);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Play', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    const action = card.play(player);
    action.cb(oceanSpace);
    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_SANCTUARY);
    expect(oceanSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.ANIMAL]});
    expect(card.resourceCount).is.eq(1);
  });

  it('Ocean Sanctuary counts as ocean for adjacency', function() {
    const oceanSpace = TestingUtils.addOcean(player);
    const action = card.play(player);
    action.cb(oceanSpace);
    const greenery = game.board.getAdjacentSpaces(oceanSpace).filter((space) => space.spaceType === SpaceType.LAND)[0];

    expect(otherPlayer.megaCredits).eq(0);

    game.addGreenery(otherPlayer, greenery.id);

    expect(otherPlayer.megaCredits).eq(2);
  });

  it('Victory Points', function() {
    card.resourceCount = 7;
    expect(card.getVictoryPoints()).eq(7);
  });

  it('Placing Ocean Sanctuary does not grant underlying space bonus', () => {
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
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_SANCTUARY);
    expect(player.plants).eq(1);
  });
});
