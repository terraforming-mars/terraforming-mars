import {expect} from 'chai';
import {SelectDelegate} from '../../src/server/inputs/SelectDelegate';
import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/server/Game';
import {getTestPlayers, newTestGame} from '../TestGame';
import {Player} from '../../src/server/Player';
import {NeutralPlayer} from '../../src/server/turmoil/Turmoil';

describe('SelectDelegate', function() {
  let players: Array<TestPlayer>;
  let game: Game;
  let selected: Player | NeutralPlayer | undefined;
  const cb = (player: Player | NeutralPlayer) => {
    selected = player;
    return undefined;
  };

  beforeEach(() => {
    game = newTestGame(3);
    players = getTestPlayers(game);
    selected = undefined;
  });

  it('Simple - Neutral', function() {
    const selectDelegate = new SelectDelegate([players[0], 'NEUTRAL'], '', cb);
    selectDelegate.process({type: 'delegate', player: 'NEUTRAL'});
    expect(selected).eq('NEUTRAL');
  });

  it('Simple - Player by color', function() {
    const selectDelegate = new SelectDelegate([players[0], 'NEUTRAL'], '', cb);
    selectDelegate.process({type: 'delegate', player: players[0].color});
    expect(selected).eq(players[0]);
  });


  it('Cannot select unavailable delegate', function() {
    const selectDelegate = new SelectDelegate([players[0], 'NEUTRAL'], '', cb);
    expect(() => selectDelegate.process({type: 'delegate', player: players[1].color}))
      .to.throw(Error, /Player not available/);
  });

  it('Cannot select unavailable neutral delegate', function() {
    const selectDelegate = new SelectDelegate([players[0]], '', cb);
    expect(() => selectDelegate.process({type: 'delegate', player: 'NEUTRAL'}))
      .to.throw(Error, /Player not available/);
  });
});
