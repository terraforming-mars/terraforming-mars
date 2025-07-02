import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {FriendsInHighPlaces} from '../../../src/server/cards/underworld/FriendsInHighPlaces';
import {TestPlayer} from '../../TestPlayer';

describe('FriendsInHighPlaces', () => {
  let player: TestPlayer;
  let card: FriendsInHighPlaces;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {underworldExpansion: true});
    card = new FriendsInHighPlaces();
  });

  const canPlayRuns = [
    {earthTags: 0, expected: false},
    {earthTags: 1, expected: false},
    {earthTags: 2, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay ' + JSON.stringify(run), () => {
      player.tagsForTest = {earth: run.earthTags};
      expect(card.canPlay(player)).eq(run.expected);
    });
  }
});
