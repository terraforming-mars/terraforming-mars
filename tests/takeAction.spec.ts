import {expect} from 'chai';
import {Phase} from '../src/common/Phase';
import {doWait, runAllActions} from './TestingUtils';
import {testGame} from './TestGame';
import {SelectCard} from '../src/server/inputs/SelectCard';
import {AlliedBanks} from '../src/server/cards/prelude/AlliedBanks';
import {Biofuels} from '../src/server/cards/prelude/Biofuels';
import {CO2Reducers} from '../src/server/cards/pathfinders/CO2Reducers';
import {Donation} from '../src/server/cards/prelude/Donation';

describe('takeAction', () => {
  it('Prelude action cycle', () => {
    const [game, player1, player2] = testGame(2, {preludeExtension: true});

    // None of these preludes require additional user input, so they're good for this test.
    const alliedBanks = new AlliedBanks();
    const biofuels = new Biofuels();
    const co2Reducers = new CO2Reducers();
    const donation = new Donation();

    game.phase = Phase.PRELUDES;
    player1.preludeCardsInHand = [alliedBanks, biofuels];
    player2.preludeCardsInHand = [co2Reducers, donation];

    expect(player1.actionsTakenThisRound).eq(0);
    expect(game.activePlayer).eq(player1.id);

    player1.takeAction();

    doWait(player1, SelectCard, (firstPrelude) => {
      expect(firstPrelude!.title).eq('Select prelude card to play');
      firstPrelude.cb([alliedBanks]);
    });
    runAllActions(game);

    expect(game.activePlayer).eq(player1.id);
    cast(player2.getWaitingFor(), undefined);

    doWait(player1, SelectCard, (selectCard) => {
      expect(selectCard.title).eq('Select prelude card to play');
      selectCard.cb([biofuels]);
    });
    runAllActions(game);

    expect(game.activePlayer).eq(player2.id);
    cast(player1.getWaitingFor(), undefined);

    doWait(player2, SelectCard, (firstPrelude) => {
      expect(firstPrelude!.title).eq('Select prelude card to play');
      firstPrelude.cb([co2Reducers]);
    });
    runAllActions(game);

    expect(game.activePlayer).eq(player2.id);
    cast(player1.getWaitingFor(), undefined);

    doWait(player2, SelectCard, (selectCard) => {
      expect(selectCard.title).eq('Select prelude card to play');
      selectCard.cb([donation]);
    });

    // expect(game.phase).eq(Phase.PRELUDES);

    runAllActions(game);

    expect(game.phase).eq(Phase.ACTION);
    expect(game.activePlayer).eq(player1.id);
    cast(player2.getWaitingFor(), undefined);
  });
});
