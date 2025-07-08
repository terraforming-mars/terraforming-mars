import {expect} from 'chai';
import {PersonalSpacecruiser} from '../../../src/server/cards/underworld/PersonalSpacecruiser';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';

describe('PersonalSpacecruiser', () => {
  it('play', () => {
    const card = new PersonalSpacecruiser();
    const [game, player] = testGame(2);
    const securityFleet = new SecurityFleet();
    player.playedCards.push(securityFleet);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(securityFleet.resourceCount).eq(1);
    expect(player.underworldData.corruption).to.eq(1);
  });

  it('canAct', () => {
    const card = new PersonalSpacecruiser();
    const [/* game */, player] = testGame(2);
    expect(card.canAct(player)).is.false;

    player.energy = 1;

    expect(card.canAct(player)).is.true;
  });

  for (const run of [
    {corruption: 1, expected: 2},
    {corruption: 4, expected: 8},
  ] as const) {
    it('action ' + JSON.stringify(run), () => {
      const card = new PersonalSpacecruiser();
      const [/* game */, player] = testGame(2);
      player.energy = 1;
      player.underworldData.corruption = run.corruption;
      card.action(player);

      expect(player.megaCredits).eq(run.expected);
    });
  }
});
