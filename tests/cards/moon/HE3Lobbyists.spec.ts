import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {HE3Lobbyists} from '../../../src/cards/moon/HE3Lobbyists';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('HE3Lobbyists', () => {
  let player: TestPlayer;
  let card: HE3Lobbyists;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new HE3Lobbyists();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.setProductionForTest({megacredits: 0});
    player.tagsForTest = {moon: 0};
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);


    player.setProductionForTest({megacredits: 0});
    player.tagsForTest = {moon: 7};
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(8);
  });
});

