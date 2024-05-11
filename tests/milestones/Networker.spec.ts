import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {IGame} from '../../src/server/IGame';
import {testGame} from '../TestGame';
import {addGreenery, addCity, cast, runAllActions} from '../TestingUtils';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {NaturalPreserveAres} from '../../src/server/cards/ares/NaturalPreserveAres';
import {EmptyBoard} from '../ares/EmptyBoard';
import {Networker} from '../../src/server/milestones/Networker';

describe('Networker', () => {
  let networker: Networker;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    [game, player, player2, player3] = testGame(3, {aresExtension: true, aresHazards: false});
    game.board = EmptyBoard.newInstance();
    networker = new Networker();
  });

  function scores(): Array<number> {
    return [
      networker.getScore(player),
      networker.getScore(player2),
      networker.getScore(player3)];
  }

  it('Takes action, Networker Milestone does not get a benefit', function() {
    // Place a tile that grants 1MC adjacency bonuses
    const naturalPreserveAres = new NaturalPreserveAres();
    naturalPreserveAres.play(player2);
    runAllActions(game);
    const action = cast(player2.popWaitingFor(), SelectSpace);
    const naturalPreserveSpace = action.spaces[0];
    action.cb(naturalPreserveSpace);

    expect(scores()).deep.eq([0, 0, 0]);

    // Place tiles from different players next to tile that grants adjacency bonuses
    const adjacentSpaces = game.board.getAdjacentSpaces(naturalPreserveSpace);

    addGreenery(player2, adjacentSpaces[0].id);

    expect(scores()).deep.eq([0, 1, 0]);

    addCity(player3, adjacentSpaces[1].id);

    expect(scores()).deep.eq([0, 1, 1]);
  });
});
