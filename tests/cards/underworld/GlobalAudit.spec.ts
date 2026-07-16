import {expect} from 'chai';
import {GlobalAudit} from '../../../src/server/cards/underworld/GlobalAudit';
import {testGame} from '../../TestGame';
import {cast, runAllActions, setRulingParty} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('GlobalAudit', () => {
  for (const run of [
    {tags: [1, 2], expected: [21, 20]},
    {tags: [0, 2], expected: [22, 20]},
    {tags: [2, 2], expected: [21, 21]},
  ] as const) {
    it('Should play ' + JSON.stringify(run), () => {
      const card = new GlobalAudit();
      const [/* game */, player, player2] = testGame(2);

      player.tagsForTest = {crime: run.tags[0]};
      player2.tagsForTest = {crime: run.tags[1]};

      cast(card.play(player), undefined);

      expect(player.terraformRating).eq(run.expected[0]);
      expect(player2.terraformRating).eq(run.expected[1]);
    });
  }

  for (const run of [
    {tags: [1, 2], mc: [2, 6], expected: [20, 20]},
    {tags: [1, 2], mc: [6, 6], expected: [21, 20]},
    {tags: [0, 2], mc: [2, 6], expected: [20, 20]},
    {tags: [0, 2], mc: [3, 6], expected: [20, 20]},
    {tags: [0, 2], mc: [5, 6], expected: [20, 20]},
    {tags: [0, 2], mc: [6, 6], expected: [22, 20]},
    {tags: [2, 2], mc: [2, 6], expected: [20, 21]},
    {tags: [2, 2], mc: [6, 6], expected: [21, 21]},
  ] as const) {
    it('Should play - reds' + JSON.stringify(run), () => {
      const card = new GlobalAudit();
      const [game, player, player2] = testGame(2, {turmoilExtension: true});

      setRulingParty(game, PartyName.REDS);

      player.tagsForTest = {crime: run.tags[0]};
      player2.tagsForTest = {crime: run.tags[1]};
      player.stock.megacredits = run.mc[0];
      player2.stock.megacredits = run.mc[1];

      cast(card.play(player), undefined);
      runAllActions(game);

      expect(player.terraformRating).eq(run.expected[0]);
      expect(player2.terraformRating).eq(run.expected[1]);
    });
  }
});
