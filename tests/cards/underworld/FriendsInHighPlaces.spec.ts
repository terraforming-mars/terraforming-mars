import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {FriendsInHighPlaces} from '../../../src/server/cards/underworld/FriendsInHighPlaces';
import {LargeConvoy} from '../../../src/server/cards/base/LargeConvoy';
import {TestPlayer} from '../../TestPlayer';
import {ProtectedValley} from '../../../src/server/cards/base/ProtectedValley';

describe('FriendsInHighPlaces', () => {
  let player: TestPlayer;
  let card: FriendsInHighPlaces;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {underworldExpansion: true});
    card = new FriendsInHighPlaces();
    player.playedCards.push(card);
  });

  const canPlayRuns = [
    {earthTags: 0, corruption: 0, expected: false},
    {earthTags: 1, corruption: 0, expected: false},
    {earthTags: 0, corruption: 1, expected: false},
    {earthTags: 1, corruption: 1, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      player.tagsForTest = {earth: run.earthTags};
      player.underworldData.corruption = run.corruption;
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  const paymentRuns = [
    {mc: 35, corruption: 0, expected: false},
    {mc: 36, corruption: 0, expected: true},
    {mc: 25, corruption: 1, expected: false},
    {mc: 26, corruption: 1, expected: true},
    {mc: 15, corruption: 2, expected: false},
    {mc: 16, corruption: 2, expected: true},
  ] as const;
  for (const run of paymentRuns) {
    it('pay for earth card ' + JSON.stringify(run), () => {
      // Large Convoy costs 36.
      const largeConvoy = new LargeConvoy();
      player.megaCredits = run.mc;
      player.underworldData.corruption = run.corruption;
      expect(player.canPlay(largeConvoy)).eq(run.expected);
    });
  }

  it('does not work with non-earth cards ', () => {
    // Protected Valley costs 23.
    const protectedValley = new ProtectedValley();
    player.megaCredits = 23;
    expect(player.canPlay(protectedValley)).is.true;
    player.megaCredits = 22;
    expect(player.canPlay(protectedValley)).is.false;
    player.underworldData.corruption = 1;
    expect(player.canPlay(protectedValley)).is.false;
  });

  it('does not work without Friends in High Places', () => {
    // Large Convoy costs 36.
    const largeConvoy = new LargeConvoy();
    player.megaCredits = 30;
    player.underworldData.corruption = 1;
    expect(player.canPlay(largeConvoy)).eq(true);
    player.playedCards.set();
    expect(player.canPlay(largeConvoy)).eq(false);
  });
});
