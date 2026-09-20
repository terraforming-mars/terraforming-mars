import {expect} from 'chai';
import {RedAppeasement} from '@/server/cards/prelude2/RedAppeasement';
import {PartyName} from '@/common/turmoil/PartyName';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {setRulingParty} from '../../TestingUtils';

describe('RedAppeasement', () => {
  let card: RedAppeasement;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new RedAppeasement();
    [game, player, player2] = testGame(3, {turmoilExtension: true});
  });

  for (const run of [
    {redsRuling: false, anyPassed: false, expected: false},
    {redsRuling: true, anyPassed: true, expected: false},
    {redsRuling: true, anyPassed: false, expected: true},
  ] as const) {
    it('canPlay ' + JSON.stringify(run), () => {
      setRulingParty(game, run.redsRuling ? PartyName.REDS : PartyName.GREENS);
      if (run.anyPassed) {
        player2.pass();
      }

      expect(card.canPlay(player)).to.eq(run.expected);
    });
  }

  it('play', () => {
    setRulingParty(game, PartyName.REDS);

    card.play(player);

    expect(player.production.megacredits).to.eq(2);
    expect(game.getPassedPlayers()).includes(player.color);
  });
});
