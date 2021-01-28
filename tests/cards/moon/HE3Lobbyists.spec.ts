import {Game} from '../../../src/Game';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {HE3Lobbyists} from '../../../src/cards/moon/HE3Lobbyists';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {Tags} from '../../../src/cards/Tags';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('HE3Lobbyists', () => {
  let player: TestPlayer;
  let card: HE3Lobbyists;
  let moonTags: number = 0;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new HE3Lobbyists();
    // In this test, getTagCount is overridden to make testing simpler.
    player.getTagCount = (tag: Tags): number => {
      switch (tag) {
      case Tags.MOON:
        return moonTags;
      default:
        throw new Error('unsupported');
      }
    };
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.setProductionForTest({megacredits: 0});
    moonTags = 0;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);


    player.setProductionForTest({megacredits: 0});
    moonTags = 7;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(7);
  });
});

