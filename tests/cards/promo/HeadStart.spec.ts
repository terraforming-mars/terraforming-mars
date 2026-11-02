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
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {BeginnerCorporation} from '../../../src/server/cards/corporation/BeginnerCorporation';
import {cast} from '../../../src/common/utils/utils';
import {IPreludeCard} from '../../../src/server/cards/prelude/IPreludeCard';

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

  function start() {
    player.preludeCardsInHand = [headStart, loan];
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

  function choose(title: string) {
    const menu = actionMenu();
    const index = menu.options.findIndex((option) => option.title === title);
    expect(index, `no "${title}" in ${menu.options.map((o) => o.title)}`).gte(0);
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

  for (const headStartFirst of [true, false]) {
    it(`Take 2 actions, as ${headStartFirst ? 'first' : 'second'} prelude`, () => {
      player.heat = 16;
      start();
      for (const prelude of headStartFirst ? [headStart, loan] : [loan, headStart]) {
        playPrelude(prelude);
        if (prelude === headStart) {
          expect(actionMenu().title).eq('Take your first action');
          choose('Convert 8 heat into temperature');
          expect(actionMenu().title).eq('Take your next action');
          choose('Convert 8 heat into temperature');
        }
      }

      expect(player.heat).eq(0);
      expectPlayer2ToPlayPreludes();
    });
  }

  it('Cannot pass, end turn, or undo during Head Start', () => {
    [game, player, player2] = testGame(2, {preludeExtension: true, undoOption: true});
    player.heat = 16;
    start();
    playPrelude(headStart);
    choose('Convert 8 heat into temperature');

    const titles = actionMenu().options.map((option) => option.title);
    expect(titles).includes('Skip this action');
    expect(titles).does.not.include('Pass for this generation');
    expect(titles).does.not.include('End Turn');
    expect(titles).does.not.include('Undo last action');
  });

  it('The corporation first action waits for the action phase', () => {
    const tharsis = new TharsisRepublic();
    player.pendingInitialActions = [tharsis];
    start();
    playPrelude(headStart);

    const titles = actionMenu().options.map((option) => formatMessage(option.title));
    expect(titles).does.not.include(`Take first action of ${tharsis.name} corporation`);
    choose('Skip this action');
    choose('Skip this action');
    playPrelude(loan);

    expect(player.pendingInitialActions).deep.eq([tharsis]);
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

    expect(reloadedPlayer.headStartActionsRemaining).eq(1);
    expect(reloaded.activePlayer.id).eq(player.id);
    expect(cast(reloadedPlayer.getWaitingFor(), OrOptions).title).eq('Take your next action');
  });
});
