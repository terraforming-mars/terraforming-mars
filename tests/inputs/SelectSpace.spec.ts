import {expect} from 'chai';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {Space} from '../../src/server/boards/Space';
import {Game} from '../../src/server/Game';
import {testGame} from '../TestGame';

describe('SelectSpace', () => {
  let game: Game;
  let selected: Space | undefined;

  const cb = (cards: Space) => {
    selected = cards;
    return undefined;
  };

  beforeEach(() => {
    [game] = testGame(1);
    selected = undefined;
  });

  it('Simple', () => {
    const selectSpace = new SelectSpace('', game.board.spaces).andThen(cb);
    selectSpace.process({type: 'space', spaceId: '05'});
    expect(selected!.id).eq('05');
  });

  it('Cannot select space not part of the set', () => {
    const selectSpace = new SelectSpace('', game.board.spaces).andThen(cb);
    expect(() => selectSpace.process({type: 'space', spaceId: '00'}))
      .to.throw(Error, /Space not available/);
  });
});
