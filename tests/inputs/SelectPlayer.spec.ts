import {expect} from 'chai';
import {SelectPlayer} from '../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {IPlayer} from '../../src/server/IPlayer';

describe('SelectPlayer', function() {
  let players: Array<TestPlayer>;
  let selected: IPlayer | undefined;
  const cb = (player: IPlayer) => {
    selected = player;
    return undefined;
  };

  beforeEach(() => {
    [/* unused */, ...players] = testGame(3);
    selected = undefined;
  });

  it('Simple - Player by id', function() {
    const selectPlayer = new SelectPlayer([players[0], players[1]], '').andThen(cb);
    selectPlayer.process({type: 'player', player: players[0].color});
    expect(selected).eq(players[0]);
  });

  it('Cannot select unavailable player', function() {
    const selectPlayer = new SelectPlayer([players[0], players[1]], '').andThen(cb);
    expect(() => selectPlayer.process({type: 'player', player: players[2].color}))
      .to.throw(Error, /Player not available/);
  });
});
