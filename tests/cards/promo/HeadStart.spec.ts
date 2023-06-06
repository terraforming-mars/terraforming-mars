import {expect} from 'chai';
import {HeadStart} from '../../../src/server/cards/promo/HeadStart';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Phase} from '../../../src/common/Phase';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BactoviralResearch} from '../../../src/server/cards/promo/BactoviralResearch';
import {Loan} from '../../../src/server/cards/prelude/Loan';
import {PlayerInput} from '../../../src/server/PlayerInput';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {CardType} from '../../../src/common/cards/CardType';

describe('HeadStart', function() {
  let headStart: HeadStart;
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    headStart = new HeadStart();
    [game, player, player2] = testGame(2, {preludeExtension: true});
  });

  it('Gain resources', () => {
    player.cardsInHand.push(fakeCard({}), fakeCard({}), fakeCard({}));
    headStart.play(player);
    expect(player.purse()).deep.eq(Units.of({megacredits: 6, steel: 2}));
  });

  function findOption(pi: PlayerInput, title: string) {
    return cast(pi, OrOptions).options.find((option) => option.title === title)!;
  }

  function dowait(player: TestPlayer, f: (waitingFor: PlayerInput) => void) {
    const [waitingFor, cb] = player.popWaitingFor2();
    f(waitingFor!);
    cb!();
  }

  it('Take 2 actions, as first prelude', () => {
    game.phase = Phase.PRELUDES;
    const ants = new Ants();
    const bactoviralResearch = new BactoviralResearch();
    const loan = new Loan();
    player.preludeCardsInHand = [headStart, loan];
    player.cardsInHand = [ants, bactoviralResearch];
    player2.preludeCardsInHand = [fakeCard({type: CardType.PRELUDE})];

    expect(player.actionsTakenThisRound).eq(0);
    expect(game.activePlayer).eq(player.id);

    player.megaCredits = headStart.cost;
    player.takeAction();

    dowait(player, (waitingFor) => {
      expect(waitingFor!.title).eq('Select prelude card to play');
      cast(waitingFor, SelectCard).cb([headStart]);
    });

    runAllActions(game);

    expect(player.actionsTakenThisRound).eq(0); // Playing preludes is not an action.
    expect(game.activePlayer).eq(player.id);

    dowait(player, (waitingFor) => {
      expect(waitingFor.title).eq('Take your first action');
      const patents1 = cast(findOption(waitingFor, 'Sell patents'), SelectCard);
      patents1.cb([player.cardsInHand[0]]);
    });

    runAllActions(game);

    expect(player.actionsTakenThisRound).eq(1);
    expect(game.activePlayer).eq(player.id);

    dowait(player, (waitingFor) => {
      expect(waitingFor.title).eq('Take your next action');
      const patents2 = cast(findOption(waitingFor, 'Sell patents'), SelectCard);
      patents2.cb([player.cardsInHand[0]]);
    });
    runAllActions(game);

    expect(game.activePlayer).eq(player.id);

    dowait(player, (waitingFor) => {
      expect(waitingFor.title).eq('Select prelude card to play');
      cast(waitingFor, SelectCard).cb([loan]);
    });

    runAllActions(game);

    expect(game.activePlayer).eq(player2.id);
  });
});
