import {expect} from 'chai';
import {HeadStart} from '../../../src/server/cards/promo/HeadStart';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, doWait, fakeCard, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Phase} from '../../../src/common/Phase';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BactoviralResearch} from '../../../src/server/cards/promo/BactoviralResearch';
import {Loan} from '../../../src/server/cards/prelude/Loan';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Donation} from '../../../src/server/cards/prelude/Donation';

describe('HeadStart', function() {
  let headStart: HeadStart;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    headStart = new HeadStart();
    [game, player, player2] = testGame(2, {preludeExtension: true});
  });

  it('Gain resources', () => {
    player.cardsInHand.push(fakeCard(), fakeCard(), fakeCard());
    headStart.play(player);
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 6, steel: 2}));
  });

  function findOption(pi: OrOptions, title: string) {
    return pi.options.find((option) => option.title === title)!;
  }

  it('Take 2 actions, as first prelude', () => {
    game.phase = Phase.PRELUDES;
    const ants = new Ants();
    const bactoviralResearch = new BactoviralResearch();
    const loan = new Loan();
    player.preludeCardsInHand = [headStart, loan];
    player.cardsInHand = [ants, bactoviralResearch];
    player2.preludeCardsInHand = [new Donation()];

    expect(player.actionsTakenThisRound).eq(0);
    expect(game.activePlayer).eq(player.id);

    player.takeAction();

    doWait(player, SelectCard, (selectCard) => {
      expect(selectCard!.title).eq('Select prelude card to play');
      selectCard.cb([headStart]);
    });

    runAllActions(game);

    expect(player.actionsTakenThisRound).eq(0); // Playing preludes is not an action.
    expect(game.activePlayer).eq(player.id);

    doWait(player, OrOptions, (waitingFor) => {
      expect(waitingFor.title).eq('Take your first action');
      const patents1 = cast(findOption(waitingFor, 'Sell patents'), SelectCard);
      patents1.cb([player.cardsInHand[0]]);
    });

    runAllActions(game);

    expect(player.actionsTakenThisRound).eq(1);
    expect(game.activePlayer).eq(player.id);

    doWait(player, OrOptions, (waitingFor) => {
      expect(waitingFor.title).eq('Take your next action');
      const patents2 = cast(findOption(waitingFor, 'Sell patents'), SelectCard);
      patents2.cb([player.cardsInHand[0]]);
    });
    runAllActions(game);

    expect(game.activePlayer).eq(player.id);

    doWait(player, SelectCard, (selectCard) => {
      expect(selectCard.title).eq('Select prelude card to play');
      selectCard.cb([loan]);
    });

    runAllActions(game);

    expect(game.activePlayer).eq(player2.id);
  });

  it('Take 2 actions, as second prelude', () => {
    game.phase = Phase.PRELUDES;
    const ants = new Ants();
    const bactoviralResearch = new BactoviralResearch();
    const loan = new Loan();
    player.preludeCardsInHand = [headStart, loan];
    player.cardsInHand = [ants, bactoviralResearch];
    player2.preludeCardsInHand = [new Donation()];

    expect(player.actionsTakenThisRound).eq(0);
    expect(game.activePlayer).eq(player.id);

    player.takeAction();

    doWait(player, SelectCard, (selectCard) => {
      expect(selectCard!.title).eq('Select prelude card to play');
      selectCard.cb([loan]);
    });

    runAllActions(game);

    expect(game.activePlayer).eq(player.id);

    doWait(player, SelectCard, (selectCard) => {
      expect(selectCard.title).eq('Select prelude card to play');
      selectCard.cb([headStart]);
    });

    runAllActions(game);

    expect(player.actionsTakenThisRound).eq(0); // Playing preludes is not an action.
    expect(game.activePlayer).eq(player.id);

    doWait(player, OrOptions, (waitingFor) => {
      expect(waitingFor.title).eq('Take your first action');
      const patents1 = cast(findOption(waitingFor, 'Sell patents'), SelectCard);
      patents1.cb([player.cardsInHand[0]]);
    });

    runAllActions(game);

    expect(player.actionsTakenThisRound).eq(1);
    expect(game.activePlayer).eq(player.id);

    doWait(player, OrOptions, (waitingFor) => {
      expect(waitingFor.title).eq('Take your next action');
      const patents2 = cast(findOption(waitingFor, 'Sell patents'), SelectCard);
      patents2.cb([player.cardsInHand[0]]);
    });
    runAllActions(game);

    expect(game.activePlayer).eq(player2.id);
  });
});
