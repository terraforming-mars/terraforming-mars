import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {DarksideMiningSyndicate} from '../../../src/server/cards/moon/DarksideMiningSyndicate';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {testRedsCosts} from '../../TestingUtils';

describe('DarksideMiningSyndicate', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: DarksideMiningSyndicate;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new DarksideMiningSyndicate();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(player.production.titanium).eq(0);
    expect(moonData.miningRate).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);
    expect(moonData.miningRate).eq(1);

    expect(player.production.titanium).eq(2);
    expect(player.getTerraformRating()).eq(15);

    card.play(player);
    expect(moonData.miningRate).eq(2);

    expect(player.production.titanium).eq(4);
    expect(player.getTerraformRating()).eq(16);

    card.play(player);
    expect(moonData.miningRate).eq(3);

    expect(player.production.titanium).eq(5);
    expect(player.getTerraformRating()).eq(17);
  });

  const redsRuns = [
    {miningRate: 6, expected: 3},
    {miningRate: 7, expected: 3},
    {miningRate: 8, expected: 0},
  ] as const;

  for (const run of redsRuns) {
    it('Works with reds ' + JSON.stringify(run), () => {
      const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true, moonExpansion: true});
      game.moonData!.miningRate = run.miningRate;
      testRedsCosts(() => player.canPlay(card), player, card.cost, run.expected);
    });
  }
});
