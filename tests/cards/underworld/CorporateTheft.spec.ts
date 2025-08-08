import {expect} from 'chai';
import {CorporateTheft} from '../../../src/server/cards/underworld/CorporateTheft';
import {testGame} from '../../TestGame';

// function toCard(e: readonly [CardName, number] | CardName) {
//   const [cardName, count] = typeof(e) === 'string' ? [e, 0] : e;
//   const card = newProjectCard(cardName)!;
//   card.resourceCount = count;
//   return card;
// }

describe('CorporateTheft', () => {
  const canPlayRuns = [
    {corruption: 1, expected: false},
    {corruption: 2, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('can play ' + JSON.stringify(run), () => {
      const card = new CorporateTheft();
      const [/* game */, player, _opponent] = testGame(2, {underworldExpansion: true});

      player.underworldData.corruption = run.corruption;

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  // TODO(kberg): Test

  it('solo', () => {
    const card = new CorporateTheft();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});

    player.underworldData.corruption = 2;
    expect(card.canAct(player)).is.false;
  });

  const canActRuns = [
    {mc: 4, expected: false},
    {mc: 5, expected: true},
  ] as const;
  for (const run of canActRuns) {
    it('canAct ' + JSON.stringify(run), () => {
      const card = new CorporateTheft();
      const [/* game */, player, _opponent] = testGame(2, {underworldExpansion: true});

      player.megaCredits = run.mc;

      expect(card.canAct(player)).eq(run.expected);
    });
  }
});
