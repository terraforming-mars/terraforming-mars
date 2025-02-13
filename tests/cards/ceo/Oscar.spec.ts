import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Oscar} from '../../../src/server/cards/ceos/Oscar';
import {TPolitician} from '../../../src/server/awards/terraCimmeria/TPolitician';
import {TempestConsultancy} from '../../../src/server/cards/moon/TempestConsultancy';

describe('Oscar', () => {
  let card: Oscar;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new Oscar();
    [game, player, player2] = testGame(2, {ceoExtension: true, turmoilExtension: true});
    player.playedCards.push(card);
    turmoil = Turmoil.getTurmoil(player.game);
  });

  it('Has +1 influence', () => {
    card.play(player);
    expect(turmoil?.getPlayerInfluence(player)).eq(1);
  });

  it('Takes OPG action', () => {
    turmoil.chairman = 'NEUTRAL';
    const preActionDelegates = turmoil.delegateReserve.get(player);
    card.action(player);
    runAllActions(game);
    expect(turmoil.chairman).eq(player);
    // Delegates in reserve decreases
    expect(turmoil.delegateReserve.get(player)).is.eq(preActionDelegates - 1);
  });

  it('Can only act once per game', () => {
    expect(card.canAct(player)).is.true;
    card.action(player);
    runAllActions(game);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Previous Chairman player gets their delegate back to reserve after Oscar OPG', () => {
    turmoil.chairman = player2;
    const prePlayer2Delegates = turmoil.delegateReserve.get(player2);
    card.action(player);
    runAllActions(game);
    expect(turmoil.chairman).eq(player);
    expect(turmoil.delegateReserve.get(player2)).is.eq(prePlayer2Delegates + 1);
  });

  it('Cannot take OPG if no delegates in reserve', () => {
    expect(card.canAct(player)).is.true;
    turmoil.delegateReserve.clear();
    expect(card.canAct(player)).is.false;
  });

  it('Cannot take OPG if already chairman', () => {
    expect(card.canAct(player)).is.true;
    turmoil.chairman = player;
    expect(card.canAct(player)).is.false;
  });

  it('OPG does not gain TR', () => {
    const tr = player.getTerraformRating();
    card.action(player);
    runAllActions(game);
    expect(turmoil.chairman).eq(player);
    expect(player.getTerraformRating()).is.eq(tr);
  });

  it('OPG gains 1 TR with Tempest Consultancy', () => {
    const tempcons = new TempestConsultancy();
    player.corporations.push(tempcons);
    const tr = player.getTerraformRating();
    card.action(player);
    runAllActions(game);

    expect(turmoil.chairman).eq(player);
    expect(player.getTerraformRating()).is.eq(tr+1);
  });

  it('OPG Counts for POLITICAN Award', () => {
    const politician = new TPolitician();
    game.awards = [];
    game.awards.push(politician);
    const preOPGScore = game.awards[0].getScore(player);
    card.action(player);
    runAllActions(game);
    expect(game.awards[0].getScore(player)).eq(preOPGScore+1);
  });
});
