import {expect} from 'chai';
import {ColonyDealer} from '../../src/colonies/ColonyDealer';
import {SerializedColonyDealer} from '../../src/colonies/SerializedColonyDealer';
import {Random} from '../../src/Random';

describe('ColonyDealer', function() {
  it('draw', () => {
    const dealer = new ColonyDealer(new Random(1));
    const colonies = dealer.drawColonies(2, undefined, false, false, false);
    expect(colonies.map((c) => c.name)).deep.eq([
      'Enceladus',
      'Luna',
      'Miranda',
      'Pluto',
      'Triton',
    ]);
  });

  it('colonies dealt by player count', () => {
    const rng = new Random(1);
    expect(new ColonyDealer(rng).drawColonies(1, undefined, false, false, false)).has.length(4);
    expect(new ColonyDealer(rng).drawColonies(2, undefined, false, false, false)).has.length(5);
    expect(new ColonyDealer(rng).drawColonies(3, undefined, false, false, false)).has.length(5);
    expect(new ColonyDealer(rng).drawColonies(4, undefined, false, false, false)).has.length(6);
    expect(new ColonyDealer(rng).drawColonies(5, undefined, false, false, false)).has.length(7);
  });

  it('serialize', () => {
    const dealer = new ColonyDealer(new Random(1));
    dealer.drawColonies(2, undefined, false, false, false); // Return value is serialized elsewhere so ignored here.
    const serialized = dealer.serialize();
    expect(serialized).to.deep.eq({
      discardedColonies: [
        'Callisto',
        'Ceres',
        'Europa',
        'Ganymede',
        'Io',
        'Titan',
      ],
    });
  });
  it('deserialize', () => {
    const dealer = new ColonyDealer(new Random(1));
    dealer.drawColonies(2, undefined, false, false, false);
    const serialized = dealer.serialize();
    const deserialized = ColonyDealer.deserialize(serialized, undefined as unknown as Random);
    expect(deserialized.discardedColonies.map((c) => c.name)).to.deep.eq([
      'Callisto',
      'Ceres',
      'Europa',
      'Ganymede',
      'Io',
      'Titan',
    ]);
  });
  it('historical deserialize', () => {
    const dealer = new ColonyDealer(new Random(1));
    dealer.drawColonies(2, undefined, false, false, false);
    const serialized: SerializedColonyDealer = {
      discardedColonies: dealer.discardedColonies.map((c) => c.serialize()),
    };
    const deserialized = ColonyDealer.deserialize(serialized, undefined as unknown as Random);
    expect(deserialized.discardedColonies.map((c) => c.name)).to.deep.eq([
      'Callisto',
      'Ceres',
      'Europa',
      'Ganymede',
      'Io',
      'Titan',
    ]);
  });
});
