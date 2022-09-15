import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {LunaArchives} from '../../../src/server/cards/moon/LunaArchives';
import {EarthEmbassy} from '../../../src/server/cards/moon/EarthEmbassy';
import {TestPlayer} from '../../TestPlayer';

describe('LunaArchives', () => {
  let player: TestPlayer;
  let card: LunaArchives;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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

  it('pay for moon card', () => {
    const ee = new EarthEmbassy();
    player.megaCredits = ee.cost;
    expect(player.canPlay(ee)).is.true;
    player.megaCredits-=2;
    expect(player.canPlay(ee)).is.false;
    card.resourceCount = 1;
    expect(player.canPlay(ee)).is.false;
    card.resourceCount = 2;
    expect(player.canPlay(ee)).is.true;
  });
});

