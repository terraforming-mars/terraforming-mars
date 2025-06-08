import {expect} from 'chai';
import {MagneticShield} from '../../../src/server/cards/promo/MagneticShield';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('MagneticShield', () => {
  let card: MagneticShield;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MagneticShield();
    [/* game */, player] = testGame(2);
  });

  const canPlayRuns = [
    {tags: 0, expected: false},
    {tags: 1, expected: false},
    {tags: 2, expected: false},
    {tags: 3, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + run.tags, () => {
      player.tagsForTest = {power: run.tags};
      expect(card.canPlay(player)).eq(run.expected);
    });
  }
  it('Should play', () => {
    card.play(player);
    expect(player.getTerraformRating()).to.eq(24);
  });
});
