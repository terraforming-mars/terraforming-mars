import {expect} from 'chai';
import {ColonyDealer} from '../../src/colonies/ColonyDealer';
import {Random} from '../../src/Random';

describe('ColonyDealer', function() {
  it('serialize', () => {
    const rng = new Random(1);
    const dealer = new ColonyDealer(rng);
    const colonies = dealer.drawColonies(2, undefined, false, false, false);
    expect(colonies.map((c) => c.name)).deep.eq(['1']);
  });

  it('colonies dealt by player count', () => {
    const rng = new Random(1);
    expect(new ColonyDealer(rng).drawColonies(1, undefined, false, false, false)).has.length(4);
    expect(new ColonyDealer(rng).drawColonies(2, undefined, false, false, false)).has.length(5);
    expect(new ColonyDealer(rng).drawColonies(3, undefined, false, false, false)).has.length(5);
    expect(new ColonyDealer(rng).drawColonies(4, undefined, false, false, false)).has.length(6);
    expect(new ColonyDealer(rng).drawColonies(5, undefined, false, false, false)).has.length(7);
  });
});
