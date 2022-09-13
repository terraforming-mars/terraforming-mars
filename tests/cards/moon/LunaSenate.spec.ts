import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaSenate} from '../../../src/server/cards/moon/LunaSenate';

describe('LunaSenate', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: LunaSenate;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.PURPLE.newPlayer();
    Game.newInstance('gameid', [player, player2], player, testGameOptions({moonExpansion: true}));
    card = new LunaSenate();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.tagsForTest = {moon: 3};
    expect(player.getPlayableCards()).does.include(card);

    player.tagsForTest = {moon: 2};
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.tagsForTest = {moon: 3};
    player2.tagsForTest = {moon: 4};
    player.production.override({megacredits: 0});

    card.play(player);

    expect(player.production.megacredits).eq(9);
  });

  it('does not count opponent wild tags', () => {
    player.tagsForTest = {moon: 3};
    player2.tagsForTest = {moon: 3, wild: 2};
    player.production.override({megacredits: 0});

    card.play(player);

    expect(player.production.megacredits).eq(8);
  });

  it('getVictoryPoints', () => {
    player.tagsForTest = {moon: 3};
    expect(card.getVictoryPoints(player)).eq(3);

    player.tagsForTest = {moon: 4};
    expect(card.getVictoryPoints(player)).eq(4);
  });
});

