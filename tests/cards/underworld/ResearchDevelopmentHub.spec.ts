import {expect} from 'chai';
import {ResearchDevelopmentHub} from '../../../src/server/cards/underworld/ResearchDevelopmentHub';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('ResearchDevelopmentHub', () => {
  it('play', () => {
    const card = new ResearchDevelopmentHub();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  const onProductionPhaseRuns = [
    {cardCounts: [6, 6, 6, 6], expected: 0},
    {cardCounts: [7, 6, 6, 6], expected: 0},
    {cardCounts: [6, 7, 6, 6], expected: 1},
    {cardCounts: [6, 7, 6, 8], expected: 2},
    {cardCounts: [6, 10, 10, 10], expected: 3},
  ] as const;
  for (const run of onProductionPhaseRuns) {
    it('production phase' + JSON.stringify(run), () => {
      const card = new ResearchDevelopmentHub();
      const [/* game */, player, player2, player3, player4] = testGame(4);

      player.drawCard(run.cardCounts[0]);
      player2.drawCard(run.cardCounts[1]);
      player3.drawCard(run.cardCounts[2]);
      player4.drawCard(run.cardCounts[3]);

      card.onProductionPhase(player);

      expect(card.resourceCount).eq(run.expected);
    });
  }
});
