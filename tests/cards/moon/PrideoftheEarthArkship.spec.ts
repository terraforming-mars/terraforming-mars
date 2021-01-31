import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {PrideoftheEarthArkship} from '../../../src/cards/moon/PrideoftheEarthArkship';
import {expect} from 'chai';
import {Tags} from '../../../src/cards/Tags';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('PrideoftheEarthArkship', () => {
  let player: Player;
  let card: PrideoftheEarthArkship;
  let tagCount = {science: 0, space: 0};

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new PrideoftheEarthArkship();
    tagCount = {science: 0, space: 0};

    // In this test, getTagCount is overridden to make testing simpler.
    player.getTagCount = (tag: Tags): number => {
      switch (tag) {
      case Tags.SPACE:
        return tagCount.space;
      case Tags.SCIENCE:
        return tagCount.science;
      default:
        throw new Error('unsupported');
      }
    };
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    tagCount = {science: 1, space: 2};
    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);

    tagCount = {science: 0, space: 2};
    player.titanium = 2;
    expect(player.getPlayableCards()).does.not.include(card);

    tagCount = {science: 1, space: 1};
    player.titanium = 2;
    expect(player.getPlayableCards()).does.not.include(card);

    tagCount = {science: 1, space: 2};
    player.titanium = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;

    card.play(player);

    expect(player.titanium).eq(1);
  });

  it('act', () => {
    tagCount = {science: 0, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    tagCount = {science: 1, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    tagCount = {science: 2, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    tagCount = {science: 3, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    tagCount = {science: 4, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(0);

    tagCount = {science: 5, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    tagCount = {science: 6, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    tagCount = {science: 7, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    tagCount = {science: 8, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    tagCount = {science: 9, space: 0};
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(1);

    tagCount = {science: 10, space: 0};
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
