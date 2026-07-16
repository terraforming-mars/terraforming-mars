import {expect} from 'chai';
import {Nanofoundry} from '../../../src/server/cards/underworld/Nanofoundry';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Nanofoundry', () => {
  const canPlayRuns = [
    {it: '1', scienceTags: 1, energyProduction: 4, expected: false},
    {it: '2', scienceTags: 1, energyProduction: 5, expected: false},
    {it: '3', scienceTags: 2, energyProduction: 4, expected: false},
    {it: '4', scienceTags: 2, energyProduction: 5, expected: true},
  ] as const;

  for (const run of canPlayRuns) {
    it('canPlay ' + run.it, () => {
      const card = new Nanofoundry();
      const [/* game */, player] = testGame(2);
      player.tagsForTest = {science: run.scienceTags};
      player.production.override({energy: run.energyProduction});
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('Should play', () => {
    const card = new Nanofoundry();
    const [/* game */, player] = testGame(2);

    player.production.override({energy: 5});
    player.tagsForTest = {power: 4};

    cast(card.play(player), undefined);

    expect(player.production.energy).to.eq(0);
    expect(player.cardsInHand).has.length(5); // 5 cards, because this card has a power tag.
  });
});
