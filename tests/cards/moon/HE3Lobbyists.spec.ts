import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {HE3Lobbyists} from '../../../src/server/cards/moon/HE3Lobbyists';

describe('HE3Lobbyists', () => {
  let player: TestPlayer;
  let card: HE3Lobbyists;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new HE3Lobbyists();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.production.override({megacredits: 0});
    player.tagsForTest = {moon: 0};
    card.play(player);
    expect(player.production.megacredits).eq(1);


    player.production.override({megacredits: 0});
    player.tagsForTest = {moon: 7};
    card.play(player);
    expect(player.production.megacredits).eq(8);
  });
});

