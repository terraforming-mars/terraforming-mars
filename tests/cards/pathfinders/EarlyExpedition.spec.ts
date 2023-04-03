import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {expect} from 'chai';
import {EarlyExpedition} from '../../../src/server/cards/pathfinders/EarlyExpedition';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions, setTemperature} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('EarlyExpedition', function() {
  let card: EarlyExpedition;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new EarlyExpedition();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
  });

  it('canPlay', function() {
    setTemperature(game, -16);
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.false;

    setTemperature(game, -18);
    player.production.override({energy: 0});
    expect(card.canPlay(player)).is.false;

    setTemperature(game, -18);
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    player.production.override({energy: 1});
    const lunarObservationPost = new LunarObservationPost(); // Holds data.
    player.playedCards = [lunarObservationPost];

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(player.production.asUnits()).eql(Units.of({megacredits: 3}));

    let tiles = 0;
    selectSpace.availableSpaces.forEach((space) => {
      game.board.getAdjacentSpaces(space).forEach((s) => {
        if (s.tile !== undefined) tiles++;
      });
    });
    expect(tiles).eq(0);

    selectSpace.cb(selectSpace.availableSpaces[0]);

    runAllActions(game);

    expect(lunarObservationPost.resourceCount).eq(1);
  });
});
