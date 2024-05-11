import {expect} from 'chai';
import {MetallicAsteroid} from '../../../src/server/cards/ares/MetallicAsteroid';
import {IGame} from '../../../src/server/IGame';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('MetallicAsteroid', function() {
  let card: MetallicAsteroid;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new MetallicAsteroid();
    [game, player, otherPlayer] = testGame(2, {aresExtension: true});
  });

  it('Play', function() {
    otherPlayer.plants = 5;

    expect(player.titanium).eq(0);
    expect(game.getTemperature()).eq(-30);
    expect(game.deferredActions).has.lengthOf(0);

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    expect(player.titanium).eq(1);
    expect(game.getTemperature()).eq(-28);
    // This interrupt is for removing four plants. Not going to do further
    // testing on this because it's beyond the scope of this test without
    // exposing more from the source method.
    expect(game.deferredActions).is.length(1);

    const space = game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(space);
    expect(space.player).to.eq(player);
    expect(space.tile!.tileType).to.eq(TileType.METALLIC_ASTEROID);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.TITANIUM]});
  });
});
