import {expect} from 'chai';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {ISpace} from '../../src/server/boards/ISpace';
import {Game} from '../../src/server/Game';
import {testGame} from '../TestGame';

describe('SelectSpace', () => {
  let game: Game;
  let selected: ISpace | undefined;

  const cb = (cards: ISpace) => {
    selected = cards;
    return undefined;
  };

  beforeEach(() => {
    [game] = testGame(1);
    selected = undefined;
  });

  it('Simple', () => {
    const selectSpace = new SelectSpace('', game.board.spaces, cb);
    selectSpace.process({type: 'space', spaceId: '05'});
    expect(selected!.id).eq('05');
  });

  it('Cannot select space not part of the set', () => {
    const selectSpace = new SelectSpace('', game.board.spaces, cb);
    expect(() => selectSpace.process({type: 'space', spaceId: '00'}))
      .to.throw(Error, /Space not available/);
  });
});
