import {expect} from 'chai';
import {PermafrostExtraction} from '../../../src/server/cards/base/PermafrostExtraction';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {runAllActions, cast, setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('PermafrostExtraction', () => {
  let card: PermafrostExtraction;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new PermafrostExtraction();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, -8);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(game.board.getOceanSpaces()).has.length(1);
  });
});
