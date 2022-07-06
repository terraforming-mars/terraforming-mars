import {expect} from 'chai';
import {DataLeak} from '../../../src/cards/pathfinders/DataLeak';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {LunarObservationPost} from '../../../src/cards/moon/LunarObservationPost';
import {runAllActions} from '../../TestingUtils';

describe('DataLeak', function() {
  let card: DataLeak;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DataLeak();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('play', function() {
    const lunarObservationPost = new LunarObservationPost();
    player.playedCards = [lunarObservationPost];

    card.play(player);
    runAllActions(game);

    expect(lunarObservationPost.resourceCount).eq(5);
  });
});
