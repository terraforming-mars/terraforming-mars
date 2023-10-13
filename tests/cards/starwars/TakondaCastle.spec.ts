import {expect} from 'chai';
import {TakondaCastle} from '../../../src/server/cards/starwars/TakondaCastle';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Tag} from '../../../src/common/cards/Tag';

describe('TakondaCastle', () => {
  let card: TakondaCastle;
  let player: TestPlayer;

  beforeEach(() => {
    card = new TakondaCastle();
    [/* skipped */, player] = testGame(1, {starWarsExpansion: true});
  });

  it('play', () => {
    function test(tags: Partial<Record<Tag, number>>, expected: number) {
      player.megaCredits = 0;
      player.tagsForTest = tags;
      card.play(player);

      expect(player.megaCredits).eq(expected);
    }

    test({}, 0);
    test({microbe: 1}, 1);
    test({animal: 1}, 1);
    test({animal: 1, microbe: 1}, 2);
    test({animal: 2, microbe: 3}, 5);
    test({animal: 2, microbe: 3, wild: 4}, 9);
  });
});
