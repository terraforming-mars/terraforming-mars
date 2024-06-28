import {expect} from 'chai';
import {AnubisSecurities} from '../../../src/server/cards/underworld/AnubisSecurities';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {Ants} from '../../../src/server/cards/base/Ants';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';

describe('AnubisSecurities', () => {
  it('First action', () => {
    const card = new AnubisSecurities();
    const [/* game */, player] = testGame(2);
    player.playedCards.push(card);

    // AI Central needs 3 science tags.
    const aiCentral = new AICentral();
    // Ants needs 4% oxygen
    const ants = new Ants();
    player.cardsInHand = [aiCentral, ants];
    player.megaCredits = Math.max(aiCentral.cost, ants.cost);

    expect(player.canPlay(aiCentral)).is.false;
    expect(player.canPlay(ants)).is.false;

    cast(card.initialAction(player), undefined);
    runAllActions(player.game);
    const selectProjectCardToPlay = cast(player.popWaitingFor(), SelectProjectCardToPlay);

    expect(selectProjectCardToPlay.cards).deep.eq([ants]);
    // Anubis Securities doesn't touch tag requirements.
    expect(player.canPlay(aiCentral)).is.false;
    // But it does touch global requirements.
    expect(player.canPlay(ants)).is.true;

    // TODO(kberg): Add test that selects the card, and then shows that the global parameter
    // bonus no longer applies.
  });

  it('TR effect, self', () => {
    const card = new AnubisSecurities();
    const [/* game */, player] = testGame(2);

    player.corporations.push(card);
    player.megaCredits = 0;

    player.increaseTerraformRating(1);
    expect(player.megaCredits).eq(2);

    player.increaseTerraformRating(2);
    expect(player.megaCredits).eq(6);
  });

  it('TR effect, opponent', () => {
    const card = new AnubisSecurities();
    const [/* game */, player, player2] = testGame(2);

    player.corporations.push(card);
    player.megaCredits = 0;
    player2.megaCredits = 0;

    player2.increaseTerraformRating(1);
    expect(player2.megaCredits).eq(2);
    expect(player.megaCredits).eq(0);

    player2.increaseTerraformRating(2);
    expect(player2.megaCredits).eq(6);
    expect(player.megaCredits).eq(0);
  });

  const onProductionPhaseRuns = [
    {corruptions: [0, 0], expected: {mc: [2, 10], tr: 21}},
    {corruptions: [1, 0], expected: {mc: [8, 10], tr: 21}},
    {corruptions: [2, 0], expected: {mc: [14, 10], tr: 21}},
    {corruptions: [0, 1], expected: {mc: [1, 9], tr: 20}},
    {corruptions: [0, 2], expected: {mc: [2, 8], tr: 20}},
    {corruptions: [0, 3], expected: {mc: [3, 7], tr: 20}},
  ] as const;
  for (const run of onProductionPhaseRuns) {
    it('production phase ' + JSON.stringify(run), () => {
      const card = new AnubisSecurities();
      const [game, player, player2] = testGame(2);

      player.corporations.push(card);
      player.underworldData.corruption = run.corruptions[0];
      player2.underworldData.corruption = run.corruptions[1];

      player.megaCredits = 0;
      player2.megaCredits = 10;

      card.onProductionPhase(player);
      runAllActions(game);

      expect(player.megaCredits).eq(run.expected.mc[0]);
      expect(player2.megaCredits).eq(run.expected.mc[1]);
      expect(player.getTerraformRating()).eq(run.expected.tr);
    });
  }
});
