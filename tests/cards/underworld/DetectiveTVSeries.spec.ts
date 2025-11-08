import {expect} from 'chai';
import {DetectiveTVSeries} from '../../../src/server/cards/underworld/DetectiveTVSeries';
import {testGame} from '../../TestGame';
import {Scapegoat} from '../../../src/server/cards/underworld/Scapegoat';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';

describe('DetectiveTVSeries', () => {
  const effectRuns = [
    {played: false, crimeTagCard: false, player: 0, expected: 0},
    {played: true, crimeTagCard: true, player: 0, expected: 2},
    {played: true, crimeTagCard: true, player: 1, expected: 2},
    {played: true, crimeTagCard: false, player: 0, expected: 0},
    {played: true, crimeTagCard: false, player: 1, expected: 0},
  ];
  for (const run of effectRuns) {
    it('effect ' + JSON.stringify(run), () => {
      const card = new DetectiveTVSeries();
      const [game, player] = testGame(2, {underworldExpansion: true});

      if (run.played) {
        player.playedCards.push(card);
      }
      const crimeCard = new Scapegoat();
      const nonCrimeCard = new MicroMills();

      const activePlayer = game.players[run.player];
      const activeCard = run.crimeTagCard ? crimeCard : nonCrimeCard;
      activePlayer.playCard(activeCard);

      expect(player.megaCredits).eq(run.expected);
    });
  }
});
