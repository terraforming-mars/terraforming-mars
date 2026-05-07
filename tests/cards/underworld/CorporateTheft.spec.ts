import {expect} from 'chai';
import {CorporateTheft} from '../../../src/server/cards/underworld/CorporateTheft';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {cast} from '../../../src/common/utils/utils';

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

  it('action - steal standard resource', () => {
    const card = new CorporateTheft();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);
    player.megaCredits = 5;
    player2.steel = 3;
    // player2 has no corruption, so no block prompt will appear.

    const options = cast(card.action(player), OrOptions);

    const stealSteel = cast(options.options.find((o) => o.buttonLabel === 'Steal steel'), SelectOption);
    stealSteel.cb(undefined);
    options.cb(undefined);
    runAllActions(game);

    expect(player2.steel).eq(2); // 1 steel was stolen
    expect(player.megaCredits).eq(0); // 5 M€ paid
  });

  it('action - steal corruption', () => {
    const card = new CorporateTheft();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);
    player.megaCredits = 5;
    player2.underworldData.corruption = 2;

    const options = cast(card.action(player), OrOptions);

    const stealCorruption = cast(options.options.find((o) => o.buttonLabel === 'Steal corruption'), SelectOption);
    stealCorruption.cb(undefined); // Defers maybeBlockAttack for player2.
    options.cb(undefined); // Fire the payment deferred.
    runAllActions(game);

    // player2 gets a blocking prompt. Choose not to block.
    const blockOptions = cast(player2.popWaitingFor(), OrOptions);
    const doNotBlock = cast(blockOptions.options.find((o) => o.buttonLabel === 'Do not block'), SelectOption);
    doNotBlock.cb(undefined);
    runAllActions(game);

    expect(player2.underworldData.corruption).eq(1); // lost 1 corruption
    expect(player.underworldData.corruption).eq(1); // gained 1 corruption
    expect(player.megaCredits).eq(0); // 5 M€ paid
  });

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
