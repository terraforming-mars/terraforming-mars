import {expect} from 'chai';
import {PermafrostExtraction} from '../../../src/server/cards/base/PermafrostExtraction';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {runAllActions, cast, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('PermafrostExtraction', function() {
  let card: PermafrostExtraction;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new PermafrostExtraction();
    [game, player] = testGame(2);
  });

  it('Cannot play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, -8);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(game.board.getOceanSpaces()).has.length(1);
  });
});
