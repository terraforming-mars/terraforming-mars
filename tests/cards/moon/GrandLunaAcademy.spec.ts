import {expect} from 'chai';
import {testGameOptions} from '../../TestingUtils';
import {GrandLunaAcademy} from '../../../src/server/cards/moon/GrandLunaAcademy';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';

describe('GrandLunaAcademy', () => {
  let player: TestPlayer;
  let card: GrandLunaAcademy;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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

