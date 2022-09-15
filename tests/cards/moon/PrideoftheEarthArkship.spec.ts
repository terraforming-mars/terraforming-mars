import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {PrideoftheEarthArkship} from '../../../src/server/cards/moon/PrideoftheEarthArkship';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';

describe('PrideoftheEarthArkship', () => {
  let player: TestPlayer;
  let card: PrideoftheEarthArkship;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new PrideoftheEarthArkship();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.tagsForTest = {science: 1, space: 2};
    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);

    player.tagsForTest = {science: 0, space: 2};
    player.titanium = 2;
    expect(player.getPlayableCards()).does.not.include(card);

    player.tagsForTest = {science: 1, space: 1};
    player.titanium = 2;
    expect(player.getPlayableCards()).does.not.include(card);

    player.tagsForTest = {science: 1, space: 2};
    player.titanium = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;

    card.play(player);

    expect(player.titanium).eq(1);
  });

  it('act', () => {
    player.tagsForTest = {science: 0, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    player.tagsForTest = {science: 1, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    player.tagsForTest = {science: 2, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    player.tagsForTest = {science: 3, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    player.tagsForTest = {science: 4, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    player.tagsForTest = {science: 5, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    player.tagsForTest = {science: 6, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    player.tagsForTest = {science: 7, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    player.tagsForTest = {science: 8, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    player.tagsForTest = {science: 9, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    player.tagsForTest = {science: 10, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(2);
  });

  it('getVictoryPoints', () => {
    card.resourceCount = 0;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(2);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(3);
  });
});
