import {expect} from 'chai';
import {MercenarySquad} from '../../../src/server/cards/underworld/MercenarySquad';
import {NitriteReducingBacteria} from '../../../src/server/cards/base/NitriteReducingBacteria';
import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions, cast, churn} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {range} from '../../../src/common/utils/utils';

describe('MercenarySquad', () => {
  let card: MercenarySquad;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MercenarySquad();
    [game, player, player2] = testGame(2, {underworldExpansion: true});
  });

  const canPlayRuns = [
    {corruption: 1, count: 1, protectedHabitats: true, expected: false},
    {corruption: 0, count: 1, protectedHabitats: false, expected: false},
    {corruption: 1, count: 0, protectedHabitats: false, expected: false},
    {corruption: 1, count: 1, protectedHabitats: false, expected: true},
  ] as const;
  for (const idx of range(canPlayRuns.length)) {
    it('canPlay: ' + idx, () => {
      const run = canPlayRuns[idx];
      player.underworldData.corruption = run.corruption;
      const tardigrades = new Tardigrades();
      tardigrades.resourceCount = run.count;
      player2.playedCards.push(tardigrades);
      if (run.protectedHabitats) {
        player2.playedCards.push(new ProtectedHabitats());
      }

      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('Play', () => {
    const tardigrades = new Tardigrades();
    const nitriteReducingBacteria = new NitriteReducingBacteria();
    tardigrades.resourceCount = 3;
    nitriteReducingBacteria.resourceCount = 2;

    player2.playedCards.push(tardigrades, nitriteReducingBacteria);

    const selectCard = cast(churn(card.play(player), player), SelectCard);
    expect(selectCard.cards).has.lengthOf(2);
    selectCard.cb([tardigrades]);
    runAllActions(game);

    expect(nitriteReducingBacteria.resourceCount).to.eq(2);
    expect(tardigrades.resourceCount).to.eq(1);
  });
});
