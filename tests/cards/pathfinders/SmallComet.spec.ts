import {expect} from 'chai';
import {SmallComet} from '../../../src/server/cards/pathfinders/SmallComet';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('SmallComet', function() {
  let card: SmallComet;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SmallComet();
    [game, player, player2, player3] = testGame(3);
  });

  it('play', function() {
    expect(player.getTerraformRating()).eq(20);
    expect(player.game.getTemperature()).eq(-30);
    player.plants = 5;
    player2.plants = 15;
    player3.plants = 400;

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    const space = action.spaces[0];
    expect(action.spaces.some((space) => space.spaceType !== SpaceType.LAND)).is.false;
    expect(space.tile).is.undefined;

    action.cb(space);

    expect(space.tile?.tileType).eq(TileType.OCEAN);

    runAllActions(game);

    expect(player.getTerraformRating()).eq(23);
    expect(player.game.getTemperature()).eq(-28);
    expect(player.game.getOxygenLevel()).eq(1);
    expect(player.plants).eq(3);
    expect(player2.plants).eq(13);
    expect(player3.plants).eq(398);
    expect(player.titanium).eq(1);
  });
});
