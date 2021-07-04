import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaArchives} from '../../../src/cards/moon/LunaArchives';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaArchives', () => {
  let player: TestPlayer;
  let card: LunaArchives;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LunaArchives();
    player.playedCards.push(card);
  });

  it('act', () => {
    player.tagsForTest = {moon: 0};
    card.action(player);
    expect(card.resourceCount).eq(0);
    expect(player.getSpendableScienceResources()).eq(0);

    player.tagsForTest = {moon: 5};
    card.action(player);
    expect(card.resourceCount).eq(5);
    expect(player.getSpendableScienceResources()).eq(5);
  });
});

