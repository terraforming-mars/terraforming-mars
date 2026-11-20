import {expect} from 'chai';
import {PartyPoliticsMarsBot} from '@/server/automa/bonusCards/PartyPoliticsMarsBot';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {fakeCard} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('PartyPoliticsMarsBot', () => {
  for (const run of [
    {reserve: 7, megacredits: 5, revealedCost: 6, placed: 2, calls: ['loseMc(5)']},
    {reserve: 7, megacredits: 5, revealedCost: 4, placed: 1, calls: []},
    {reserve: 7, megacredits: 4, revealedCost: 6, placed: 1, calls: []},
    {reserve: 1, megacredits: 5, revealedCost: 6, placed: 1, calls: []},
    {reserve: 0, megacredits: 5, revealedCost: 6, placed: 0, calls: []},
  ] as const) {
    it('places a delegate, and spends 5 M€ on a second when the revealed cost divides by 3: ' + JSON.stringify(run), () => {
      const [game, human] = testGame(1, {automa: true, turmoilExtension: true});
      const botPlayer = game.marsBotPlayer!;
      const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human, megacredits: run.megacredits});
      const turmoil = Turmoil.getTurmoil(game);
      turmoil.delegateReserve.remove(botPlayer, turmoil.delegateReserve.get(botPlayer) - run.reserve);
      game.projectDeck.drawPile.push(fakeCard({cost: run.revealedCost}));

      new PartyPoliticsMarsBot().resolve(marsBot);

      expect(run.reserve - turmoil.delegateReserve.get(botPlayer)).eq(run.placed);
      expect(calls).deep.eq(run.calls);
    });
  }
});
