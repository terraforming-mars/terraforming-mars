import {expect} from 'chai';
import {ResearchDevelopmentHub} from '../../../src/server/cards/underworld/ResearchDevelopmentHub';
import {testGame} from '../../TestGame';
import {formatMessage, runAllActions} from '../../TestingUtils';
import {cast} from '../../../src/common/utils/utils';

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

  it('logs the added data', () => {
    const card = new ResearchDevelopmentHub();
    const [game, player, player2] = testGame(2);
    player2.drawCard(7);

    game.gameLog.length = 0;
    card.onProductionPhase(player);

    expect(game.gameLog.map(formatMessage).filter((message) => message.includes(' added '))).deep.eq([
      'blue added 1:cr:data: to Research & Development Hub',
    ]);
  });
});
