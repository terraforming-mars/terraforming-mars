import {expect} from 'chai';
import {GrandLunaAcademy} from '../../../src/server/cards/moon/GrandLunaAcademy';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('GrandLunaAcademy', () => {
  let player: TestPlayer;
  let card: GrandLunaAcademy;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new GrandLunaAcademy();
  });

  const cases = [[0, 0], [1, 1], [2, 1], [3, 2], [4, 2]];
  cases.forEach(([tags, cards]) => {
    it(`play: ${tags} tags, ${cards} cards`, () => {
      player.cardsInHand = [];
      player.tagsForTest = {moon: tags};
      card.play(player);
      expect(player.cardsInHand).has.length(cards);
    });
  });
});

