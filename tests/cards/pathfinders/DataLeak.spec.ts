import {expect} from 'chai';
import {DataLeak} from '../../../src/server/cards/pathfinders/DataLeak';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {runAllActions, testGame} from '../../TestingUtils';

describe('DataLeak', function() {
  let card: DataLeak;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new DataLeak();
    [game, player] = testGame(1);
  });

  it('play', function() {
    const lunarObservationPost = new LunarObservationPost();
    player.playedCards = [lunarObservationPost];

    card.play(player);
    runAllActions(game);

    expect(lunarObservationPost.resourceCount).eq(5);
  });
});
