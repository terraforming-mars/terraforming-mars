import {expect} from 'chai';
import {MetallicAsteroid} from '../../../src/cards/ares/MetallicAsteroid';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestPlayers';

describe('MetallicAsteroid', function() {
  let card: MetallicAsteroid; let player: Player; let otherPlayer: Player; let game: Game;

  beforeEach(function() {
    card = new MetallicAsteroid();
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Play', function() {
    otherPlayer.plants = 5;

    expect(player.titanium).eq(0);
    expect(game.getTemperature()).eq(-30);
    expect(game.deferredActions).has.lengthOf(0);

    const action = card.play(player);
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
