import {expect} from 'chai';
import {DeepwaterDome} from '../../../src/server/cards/underworld/DeepwaterDome';
import {testGame} from '../../TestGame';
import {addOcean, cast, runAllActions} from '../../TestingUtils';
import {assertPlaceOcean} from '../../assertions';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('DeepwaterDome', () => {
  it('play', () => {
    const card = new DeepwaterDome();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    expect(player.production.plants).eq(1);

    runAllActions(game);
    assertPlaceOcean(player, player.popWaitingFor());
  });

  for (const run of [
    {oceans: 0, excavate: true, expected: 0},
    {oceans: 1, excavate: false, expected: 0},
    {oceans: 1, excavate: true, expected: 2},
    {oceans: 2, excavate: true, expected: 2},
  ] as const) {
    it('effect ' + JSON.stringify(run), () => {
      const card = new DeepwaterDome();
      const [game, player, player2] = testGame(2, {underworldExpansion: true});
      player.playedCards.push(card);
      // Arbitrary space number with room to place oceans.
      const space = game.board.getSpaceOrThrow('10');
      const adjacentspaces = game.board.getAdjacentSpaces(space);
      for (let idx = 0; idx < run.oceans; idx++) {
        addOcean(player2, adjacentspaces[idx].id);
      }

      if (run.excavate) {
        UnderworldExpansion.excavate(player, space);
      } else {
        UnderworldExpansion.claim(player, space);
      }
      expect(player.megaCredits).eq(run.expected);
    });
  }
});
