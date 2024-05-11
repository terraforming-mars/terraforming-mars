import {expect} from 'chai';
import {OceanSanctuary} from '../../../src/server/cards/ares/OceanSanctuary';
import {IGame} from '../../../src/server/IGame';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {addOcean, cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('OceanSanctuary', function() {
  let card: OceanSanctuary;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new OceanSanctuary();
    [game, player, otherPlayer] = testGame(2, {aresExtension: true});
  });

  it('Can play', function() {
    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.false;

    addOcean(player);
    expect(card.canPlay(player)).is.true;
  });

  it('Play', function() {
    const oceanSpace = addOcean(player);
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(oceanSpace);
    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_SANCTUARY);
    expect(oceanSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.ANIMAL]});
    runAllActions(game);
    expect(card.resourceCount).is.eq(1);
  });

  it('Ocean Sanctuary counts as ocean for adjacency', function() {
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

  it('Victory Points', function() {
    card.resourceCount = 7;
    expect(card.getVictoryPoints(player)).eq(7);
  });

  it('Placing Ocean Sanctuary does not grant underlying space bonus', () => {
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
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_SANCTUARY);
    expect(player.plants).eq(1);
  });
});
