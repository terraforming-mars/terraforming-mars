import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {expect} from 'chai';
import {EarlyExpedition} from '../../../src/server/cards/pathfinders/EarlyExpedition';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {cast, runAllActions, setTemperature, testGame} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('EarlyExpedition', () => {
  let card: EarlyExpedition;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new EarlyExpedition();
    [game, player] = testGame(1);
  });

  it('canPlay', () => {
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

  it('play', () => {
    player.production.override({energy: 1});
    const lunarObservationPost = new LunarObservationPost(); // Holds data.
    player.playedCards.push(lunarObservationPost);

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    expect(player.production.asUnits()).eql(Units.of({megacredits: 3}));

    let tiles = 0;
    selectSpace.spaces.forEach((space) => {
      game.board.getAdjacentSpaces(space).forEach((s) => {
        if (s.tile !== undefined) tiles++;
      });
    });
    expect(tiles).eq(0);

    selectSpace.cb(selectSpace.spaces[0]);

    runAllActions(game);

    expect(lunarObservationPost.resourceCount).eq(1);
  });
});
