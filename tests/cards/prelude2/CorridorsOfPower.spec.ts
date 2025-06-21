import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {CorridorsOfPower} from '../../../src/server/cards/prelude2/CorridorsOfPower';
import {TestPlayer} from '../../TestPlayer';
import {Delegate, Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {ColorWithNeutral} from '../../../src/common/Color';

describe('CorridorsOfPower', () => {
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;
  let card: CorridorsOfPower;

  beforeEach(() => {
    [game, player] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
    card = new CorridorsOfPower();
  });

  it('play', () => {
    card.play(player);
    expect(player.getTerraformRating()).eq(21);
    expect(player.megaCredits).eq(4);
  });

  function getDelegate(color: ColorWithNeutral | undefined): Delegate | undefined {
    if (color === undefined) {
      return undefined;
    }
    return game.getPlayers().find((player) => player.color === color) ?? 'NEUTRAL';
  }

  const effectRuns = [
    {playedCard: false, delegates: [], initialLeader: undefined, newDelegate: 'blue', newLeader: 'blue', expected: 0},
    {playedCard: true, delegates: [], initialLeader: undefined, newDelegate: 'blue', newLeader: 'blue', expected: 1},
    {playedCard: true, delegates: [], initialLeader: undefined, newDelegate: 'red', newLeader: 'red', expected: 0},
    {playedCard: true, delegates: [], initialLeader: undefined, newDelegate: 'NEUTRAL', newLeader: 'NEUTRAL', expected: 0},
    {playedCard: true, delegates: ['blue'], initialLeader: 'blue', newDelegate: 'blue', newLeader: 'blue', expected: 0},
    {playedCard: true, delegates: ['red', 'blue'], initialLeader: 'red', newDelegate: 'blue', newLeader: 'blue', expected: 1},
  ] as const;
  for (const run of effectRuns) {
    it('effect ' + JSON.stringify(run), () => {
      const unity = turmoil.getPartyByName(PartyName.UNITY);
      unity.delegates.forEachMultiplicity((count, key) => turmoil.delegateReserve.add(key, count));
      unity.delegates.clear();
      unity.partyLeader = undefined;
      run.delegates.forEach((delegate) => unity.sendDelegate(getDelegate(delegate)!, game));
      expect(unity.partyLeader).eq(getDelegate(run.initialLeader));

      if (!run.hasOwnProperty('playedCard') || run['playedCard'] !== false) {
        player.playedCards.push(card);
      }

      unity.sendDelegate(getDelegate(run.newDelegate)!, game);
      expect(unity.partyLeader).eq(getDelegate(run.newLeader));

      expect(player.cardsInHand).has.length(run.expected);
    });
  }
});
