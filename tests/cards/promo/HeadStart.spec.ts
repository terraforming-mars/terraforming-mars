import {expect} from 'chai';
import {HeadStart} from '../../../src/server/cards/promo/HeadStart';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard, formatMessage, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {IGame} from '../../../src/server/IGame';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Phase} from '../../../src/common/Phase';
import {Loan} from '../../../src/server/cards/prelude/Loan';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {DoubleDown} from '../../../src/server/cards/promo/DoubleDown';
import {Inventrix} from '../../../src/server/cards/corporation/Inventrix';
import {BeginnerCorporation} from '../../../src/server/cards/corporation/BeginnerCorporation';
import {cast} from '../../../src/common/utils/utils';
import {IPreludeCard} from '../../../src/server/cards/prelude/IPreludeCard';
import {BoardOfDirectors} from '@/server/cards/prelude2/BoardOfDirectors';
import {Asimov} from '@/server/cards/ceos/Asimov';
import {CardName} from '@/common/cards/CardName';

describe('HeadStart', () => {
  let headStart: HeadStart;
  let loan: Loan;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    headStart = new HeadStart();
    loan = new Loan();
    [game, player, player2] = testGame(2, {preludeExtension: true});
  });

  function start(preludes: Array<IPreludeCard> = [headStart, loan]) {
    player.preludeCardsInHand = preludes;
    player2.preludeCardsInHand = [new Donation()];
    player.takeAction();
  }

  function playPrelude(prelude: IPreludeCard) {
    const selectCard = cast(player.getWaitingFor(), SelectCard<IPreludeCard>);
    expect(selectCard.title).eq('Select prelude card to play');
    player.process({type: 'card', cards: [prelude.name]});
    runAllActions(game);
  }

  function actionMenu(): OrOptions {
    expect(game.activePlayer).eq(player);
    return cast(player.getWaitingFor(), OrOptions);
  }

  function titles(): Array<string> {
    return actionMenu().options.map((option) => formatMessage(option.title));
  }

  function choose(title: string) {
    const index = titles().indexOf(title);
    expect(index, `no "${title}" in ${titles()}`).gte(0);
    player.process({type: 'or', index, response: {type: 'option'}});
    runAllActions(game);
  }

  function expectPlayer2ToPlayPreludes() {
    expect(game.phase).eq(Phase.PRELUDES);
    expect(game.activePlayer).eq(player2);
    expect(player.getWaitingFor()).is.undefined;
    expect(cast(player2.getWaitingFor(), SelectCard).title).eq('Select prelude card to play');
  }

  it('Gain resources', () => {
    player.cardsInHand.push(fakeCard(), fakeCard(), fakeCard());
    headStart.play(player);
    expect(player.stock.asUnits()).deep.eq(Units.of({megacredits: 6, steel: 2}));
  });

  for (const run of [
    {title: 'as first prelude', plays: ['headStart', 'second'], second: 'loan'},
    {title: 'as second prelude', plays: ['second', 'headStart'], second: 'loan'},
    // Double Down asks for the prelude to copy with the same prompt as playing one.
    {title: 'again when Double Down copies it', plays: ['headStart', 'second', 'headStart'], second: 'doubleDown'},
  ] as const) {
    it(`Take 2 actions ${run.title}`, () => {
      const second = run.second === 'loan' ? loan : new DoubleDown();
      player.heat = 32;
      start([headStart, second]);
      for (const play of run.plays) {
        playPrelude(play === 'headStart' ? headStart : second);
        if (play === 'headStart') {
          expect(actionMenu().title).eq('Take your first action');
          choose('Convert 8 heat into temperature');
          expect(actionMenu().title).eq('Take your next action');
          choose('Convert 8 heat into temperature');
        }
      }

      expectPlayer2ToPlayPreludes();
    });
  }

  it('Cannot pass, end turn, or undo during Head Start', () => {
    [game, player, player2] = testGame(2, {preludeExtension: true, undoOption: true});
    player.heat = 16;
    start();
    playPrelude(headStart);
    choose('Convert 8 heat into temperature');

    for (const title of ['Pass for this generation', 'Skip this action', 'End Turn', 'Undo last action']) {
      expect(titles()).does.not.include(title);
    }
  });

  it('The corporation first action is the first Head Start action', () => {
    player.heat = 8;
    player.pendingInitialActions = [new Inventrix()];
    start();
    playPrelude(headStart);

    expect(titles()).deep.eq(['Take first action of Inventrix corporation']);
    choose('Take first action of Inventrix corporation');
    expect(player.cardsInHand).has.length(3);
    expect(actionMenu().title).eq('Take your next action');
    choose('Convert 8 heat into temperature');

    playPrelude(loan);
    expectPlayer2ToPlayPreludes();
  });

  it('A player who cannot do anything loses the Head Start actions', () => {
    start();
    playPrelude(headStart);

    playPrelude(loan);
    expectPlayer2ToPlayPreludes();
  });

  it('Reloading the game keeps the remaining actions', () => {
    // Without corporations, loading a generation 1 game restarts the initial card selection.
    player.playedCards.push(new BeginnerCorporation());
    player2.playedCards.push(new BeginnerCorporation());
    player.heat = 16;
    start();
    playPrelude(headStart);
    choose('Convert 8 heat into temperature');

    const reloaded = Game.deserialize(game.serialize());
    const reloadedPlayer = reloaded.getPlayerById(player.id);

    expect(HeadStart.actionsRemaining(reloadedPlayer)).eq(1);
    expect(reloaded.activePlayer.id).eq(player.id);
    expect(cast(reloadedPlayer.getWaitingFor(), OrOptions).title).eq('Take your next action');
  });

  it('A CEO waits until Head Start is done', () => {
    const asimov = new Asimov();
    player.ceoCardsInHand.add(asimov);
    player.heat = 16;
    start([loan, headStart]);
    playPrelude(loan);
    playPrelude(headStart);
    choose('Convert 8 heat into temperature');
    choose('Convert 8 heat into temperature');

    expectPlayer2ToPlayPreludes();
    expect(player.ceoCardsInHand).has.length(1);
    expect(player.playedCards.get(CardName.ASIMOV)).is.undefined;
  });

  it('Head Start played from Board of Directors in the action phase', () => {
    const boardOfDirectors = new BoardOfDirectors();
    boardOfDirectors.resourceCount = 1;
    player.playedCards.push(boardOfDirectors);
    game.preludeDeck.drawPile.push(headStart);
    player.megaCredits = 12;
    player.heat = 24;
    player.takeAction();

    expect(game.phase).eq(Phase.ACTION);
    const index = titles().indexOf('Perform an action from a played card');
    player.process({type: 'or', index, response: {type: 'card', cards: [CardName.BOARD_OF_DIRECTORS]}});
    runAllActions(game);
    player.process({type: 'card', cards: [CardName.HEAD_START]});
    runAllActions(game);

    expect(game.phase).eq(Phase.ACTION);
    expect(player.actionsTakenThisRound).eq(1);
    expect(HeadStart.actionsRemaining(player)).eq(2);
    expect(titles()).does.not.include('End Turn');
    choose('Convert 8 heat into temperature');
    expect(HeadStart.actionsRemaining(player)).eq(1);
    choose('Convert 8 heat into temperature');
    expect(HeadStart.actionsRemaining(player)).eq(0);

    // Board of Directors was the player's first action, so they still have one more.
    expect(game.activePlayer).eq(player);
    expect(player.actionsTakenThisRound).eq(1);
    expect(titles()).includes('End Turn');
    choose('Convert 8 heat into temperature');

    expect(game.activePlayer).eq(player2);
    expect(player.getWaitingFor()).is.undefined;
  });
});
