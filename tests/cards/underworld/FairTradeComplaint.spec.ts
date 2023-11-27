import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {FairTradeComplaint} from '../../../src/server/cards/underworld/FairTradeComplaint';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {fakeCard} from '../../TestingUtils';

describe('FairTradeComplaint', function() {
  let card: FairTradeComplaint;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new FairTradeComplaint();
    [game, player] = testGame(2, {turmoilExtension: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  const resolveTests = [
    {mc: 10, handSize: 6, influence: 0, expect: {handSize: 8, mc: 10}},

    {mc: 10, handSize: 7, influence: 0, expect: {handSize: 7, mc: 9}},
    {mc: 10, handSize: 8, influence: 0, expect: {handSize: 8, mc: 8}},
    {mc: 10, handSize: 9, influence: 0, expect: {handSize: 9, mc: 7}},
    {mc: 10, handSize: 10, influence: 0, expect: {handSize: 10, mc: 6}},

    {mc: 10, handSize: 7, influence: 1, expect: {handSize: 7, mc: 10}},
    {mc: 10, handSize: 8, influence: 1, expect: {handSize: 8, mc: 10}},
    {mc: 10, handSize: 9, influence: 1, expect: {handSize: 9, mc: 9}},
    {mc: 10, handSize: 10, influence: 1, expect: {handSize: 10, mc: 8}},

    {mc: 10, handSize: 7, influence: 2, expect: {handSize: 7, mc: 10}},
    {mc: 10, handSize: 8, influence: 2, expect: {handSize: 8, mc: 10}},
    {mc: 10, handSize: 9, influence: 2, expect: {handSize: 9, mc: 10}},
    {mc: 10, handSize: 10, influence: 2, expect: {handSize: 10, mc: 10}},
  ] as const;

  for (const run of resolveTests) {
    it(`handSize: ${run.handSize}, influence: ${run.influence}`, () => {
      player.megaCredits = run.mc;
      turmoil.addInfluenceBonus(player, run.influence);
      for (let i = 0; i < run.handSize; i++) {
        player.cardsInHand.push(fakeCard());
      }

      card.resolve(game, turmoil);

      expect(player.cardsInHand).has.length(run.expect.handSize);
      expect(player.megaCredits).eq(run.expect.mc);
    });
  }
});
