import {expect} from 'chai';

import {SelectProductionToLoseDeferred} from '../../src/deferredActions/SelectProductionToLoseDeferred';
import {Units} from '../../src/common/Units';
import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/Game';
import {newTestGame, getTestPlayer} from '../TestGame';

describe('SelectProductionToLose', function() {
  let game: Game;
  let player: TestPlayer;

  beforeEach(() => {
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('sanity test', function() {
    expect(() => cb({}, 1)).to.throw();
    cb({megacredits: 1}, 1);
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: -1}));
  });

  function cb(units: Partial<Units>, count: number) {
    const deferred = new SelectProductionToLoseDeferred(player, count);
    const sptl = deferred.execute();

    const input = JSON.stringify(Units.of(units));
    player.runInput([[input]], sptl);
  }
});

