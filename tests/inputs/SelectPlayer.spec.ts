import {expect} from 'chai';
import {SelectPlayer} from '../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/server/Game';
import {getTestPlayers, newTestGame} from '../TestGame';
import {Player} from '../../src/server/Player';

describe('SelectPlayer', function() {
  let players: Array<TestPlayer>;
  let game: Game;
  let selected: Player | undefined;
  const cb = (player: Player) => {
    selected = player;
    return undefined;
  };

  beforeEach(() => {
    game = newTestGame(3);
    players = getTestPlayers(game);
    selected = undefined;
  });

  it('Simple - Player by id', function() {
    const selectPlayer = new SelectPlayer([players[0], players[1]], '', '', cb);
    selectPlayer.process({type: 'player', player: players[0].color});
    expect(selected).eq(players[0]);
  });

  it('Cannot select unavailable player', function() {
    const selectPlayer = new SelectPlayer([players[0], players[1]], '', '', cb);
    expect(() => selectPlayer.process({type: 'player', player: players[2].color}))
      .to.throw(Error, /Player not available/);
  });
});
