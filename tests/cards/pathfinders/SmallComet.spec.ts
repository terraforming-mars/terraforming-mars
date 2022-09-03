import {expect} from 'chai';
import {SmallComet} from '../../../src/server/cards/pathfinders/SmallComet';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../TestingUtils';

describe('SmallComet', function() {
  let card: SmallComet;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(function() {
    card = new SmallComet();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    player3 = TestPlayer.GREEN.newPlayer();
    Game.newInstance('gameid', [player, player2, player3], player);
  });

  it('play', function() {
    expect(player.getTerraformRating()).eq(20);
    expect(player.game.getTemperature()).eq(-30);
    player.plants = 5;
    player2.plants = 15;
    player3.plants = 400;

    const action = cast(card.play(player), SelectSpace);

    expect(player.getTerraformRating()).eq(22);
    expect(player.game.getTemperature()).eq(-28);
    expect(player.game.getOxygenLevel()).eq(1);
    expect(player.plants).eq(3);
    expect(player2.plants).eq(13);
    expect(player3.plants).eq(398);
    expect(player.titanium).eq(1);

    const space = action.availableSpaces[0];
    expect(action.availableSpaces.some((space) => space.spaceType !== SpaceType.LAND)).is.false;
    expect(space.tile).is.undefined;

    action?.cb(space);

    expect(space.tile?.tileType).eq(TileType.OCEAN);
    expect(player.getTerraformRating()).eq(23);
  });
});
