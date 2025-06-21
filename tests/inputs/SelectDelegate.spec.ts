import {expect} from 'chai';
import {SelectDelegate} from '../../src/server/inputs/SelectDelegate';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {IPlayer} from '../../src/server/IPlayer';
import {NeutralPlayer} from '../../src/server/turmoil/Turmoil';

describe('SelectDelegate', () => {
  let players: Array<TestPlayer>;
  let selected: IPlayer | NeutralPlayer | undefined;
  const cb = (player: IPlayer | NeutralPlayer) => {
    selected = player;
    return undefined;
  };

  beforeEach(() => {
    [/* unused */, ...players] = testGame(3);
    selected = undefined;
  });

  it('Simple - Neutral', () => {
    const selectDelegate = new SelectDelegate([players[0], 'NEUTRAL'], '').andThen(cb);
    selectDelegate.process({type: 'delegate', player: 'NEUTRAL'});
    expect(selected).eq('NEUTRAL');
  });

  it('Simple - Player by color', () => {
    const selectDelegate = new SelectDelegate([players[0], 'NEUTRAL'], '').andThen(cb);
    selectDelegate.process({type: 'delegate', player: players[0].color});
    expect(selected).eq(players[0]);
  });


  it('Cannot select unavailable delegate', () => {
    const selectDelegate = new SelectDelegate([players[0], 'NEUTRAL'], '').andThen(cb);
    expect(() => selectDelegate.process({type: 'delegate', player: players[1].color}))
      .to.throw(Error, /Player not available/);
  });

  it('Cannot select unavailable neutral delegate', () => {
    const selectDelegate = new SelectDelegate([players[0]], '').andThen(cb);
    expect(() => selectDelegate.process({type: 'delegate', player: 'NEUTRAL'}))
      .to.throw(Error, /Player not available/);
  });
});
