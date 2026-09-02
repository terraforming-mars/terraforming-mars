import {expect} from 'chai';
import {ColonyDealer} from '../../src/server/colonies/ColonyDealer';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {toName} from '../../src/common/utils/utils';
import {ColonyName} from '../../src/common/colonies/ColonyName';

describe('ColonyDealer', () => {
  const options = {...DEFAULT_GAME_OPTIONS, venusNextExtension: false, coloniesExtension: false, turmoilExtension: false, communityCardsOption: false};

  it('draw', () => {
    const dealer = new ColonyDealer(new SeededRandom(1), options);
    dealer.drawColonies(2);
    expect(dealer.colonies.map(toName)).deep.eq([
      'Enceladus',
      'Luna',
      'Miranda',
      'Pluto',
      'Triton',
    ]);
    expect(dealer.discardedColonies.map(toName)).deep.eq([
      'Callisto',
      'Ceres',
      'Europa',
      'Ganymede',
      'Io',
      'Titan',
    ]);
  });

  for (const run of [
    {playerCount: 1, expected: 4},
    {playerCount: 2, expected: 5},
    {playerCount: 3, expected: 5},
    {playerCount: 4, expected: 6},
    {playerCount: 5, expected: 7},
  ] as const) {
    it('colonies dealt by player count: ' + run.playerCount, () => {
      const rng = new SeededRandom(1);
      const dealer = new ColonyDealer(rng, options);
      dealer.drawColonies(run.playerCount);
      expect(dealer.colonies).has.length(run.expected);
    });
  }

  it('custom colonies', () => {
    const rng = new SeededRandom(1);
    const dealer = new ColonyDealer(rng, {
      ...options,
      customColoniesList: [ColonyName.IAPETUS_II, ColonyName.CALLISTO, ColonyName.CERES, ColonyName.ENCELADUS],
    });
    dealer.drawColonies(1);
    expect(dealer.colonies.map(toName)).to.have.members([
      'Iapetus II',
      'Callisto',
      'Ceres',
      'Enceladus',
    ]);
  });
});
