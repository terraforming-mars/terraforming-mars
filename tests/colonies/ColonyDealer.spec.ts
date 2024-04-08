import {expect} from 'chai';
import {ColonyDealer} from '../../src/server/colonies/ColonyDealer';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';

describe('ColonyDealer', function() {
  const options = {...DEFAULT_GAME_OPTIONS, venusNextExtension: false, coloniesExtension: false, turmoilExtension: false, communityCardsOption: false};

  it('draw', () => {
    const dealer = new ColonyDealer(new SeededRandom(1), options);
    dealer.drawColonies(2);
    expect(dealer.colonies.map((c) => c.name)).deep.eq([
      'Enceladus',
      'Luna',
      'Miranda',
      'Pluto',
      'Triton',
    ]);
    expect(dealer.discardedColonies.map((c) => c.name)).deep.eq([
      'Callisto',
      'Ceres',
      'Europa',
      'Ganymede',
      'Io',
      'Titan',
    ]);
  });

  it('colonies dealt by player count', () => {
    const rng = new SeededRandom(1);
    let dealer = new ColonyDealer(rng, options);
    dealer.drawColonies(1);
    expect(dealer.colonies).has.length(4);

    dealer = new ColonyDealer(rng, options);
    dealer.drawColonies(2);
    expect(dealer.colonies).has.length(5);

    dealer = new ColonyDealer(rng, options);
    dealer.drawColonies(3);
    expect(dealer.colonies).has.length(5);

    dealer = new ColonyDealer(rng, options);
    dealer.drawColonies(4);
    expect(dealer.colonies).has.length(6);

    dealer = new ColonyDealer(rng, options);
    dealer.drawColonies(5);
    expect(dealer.colonies).has.length(7);
  });
});
