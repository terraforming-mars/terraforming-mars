import {expect} from 'chai';

import {SelectProductionToLoseDeferred} from '../../src/server/deferredActions/SelectProductionToLoseDeferred';
import {Units} from '../../src/common/Units';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';

describe('SelectProductionToLoseDeferred', () => {
  let player: TestPlayer;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
  });

  it('sanity test', () => {
    expect(() => cb({}, 1)).to.throw();
    cb({megacredits: 1}, 1);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: -1}));
  });

  it('prevents taking too much production', () => {
    player.production.override({megacredits: 5, heat: 10});
    player.megaCredits = 100;
    player.heat = 100;
    expect(() => cb({megacredits: 12}, 12)).to.throw();
    expect(() => cb({heat: 12, megacredits: 8}, 20)).to.throw();
  });

  it('prevents negative production', () => {
    player.production.override({megacredits: 10, heat: 10});
    player.megaCredits = 100;
    player.heat = 100;
    expect(() => cb({megacredits: 15, heat: 5, steel: -10}, 10)).to.throw();
  });

  it('allows taking enough production', () => {
    player.production.override({megacredits: 10, heat: 10});
    cb({megacredits: 5}, 5);
    cb({megacredits: 3, heat: 2}, 5);
    cb({megacredits: 2, heat: 8}, 10);
    expect(player.production.asUnits()).deep.eq(Units.of({}));
  });

  function cb(units: Partial<Units>, count: number) {
    const deferred = new SelectProductionToLoseDeferred(player, count);
    const sptl = deferred.execute();

    player.runInput({type: 'productionToLose', units: Units.of(units)}, sptl);
  }
});

