import {expect} from 'chai';

import {SelectProductionToLoseDeferred} from '../../src/server/deferredActions/SelectProductionToLoseDeferred';
import {Units} from '../../src/common/Units';
import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/server/Game';
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
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: -1}));
  });

  it('prevents taking too much production', function() {
    player.production.override({megacredits: 5, heat: 10});
    player.megaCredits = 100;
    player.heat = 100;
    expect(() => cb({megacredits: 12}, 12)).to.throw();
    expect(() => cb({heat: 12, megacredits: 8}, 20)).to.throw();
  });

  it('prevents negative production', function() {
    player.production.override({megacredits: 10, heat: 10});
    player.megaCredits = 100;
    player.heat = 100;
    expect(() => cb({megacredits: 15, heat: 5, steel: -10}, 10)).to.throw();
  });

  it('allows taking enough production', function() {
    player.production.override({megacredits: 10, heat: 10});
    cb({megacredits: 5}, 5);
    cb({megacredits: 3, heat: 2}, 5);
    cb({megacredits: 2, heat: 8}, 10);
    expect(player.production.asUnits()).deep.eq(Units.of({}));
  });

  function cb(units: Partial<Units>, count: number) {
    const deferred = new SelectProductionToLoseDeferred(player, count);
    const sptl = deferred.execute();

    const input = JSON.stringify(Units.of(units));
    player.runInput([[input]], sptl);
  }
});

