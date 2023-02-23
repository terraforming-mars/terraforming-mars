import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';

import {Oscar} from '../../../src/server/cards/ceos/Oscar';
import {Politician} from '../../../src/server/awards/terraCimmeria/Politician';

describe('Oscar', function() {
  let card: Oscar;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new Oscar();
    game = newTestGame(1, {ceoExtension: true, turmoilExtension: true});
    player = getTestPlayer(game, 0);
    player.playedCards.push(card);
    turmoil = Turmoil.getTurmoil(player.game);
  });

  it('Has +1 influence', function() {
    card.play(player);
    expect(turmoil?.getPlayerInfluence(player)).eq(1);
  });

  it('Takes OPG action', function() {
    turmoil.chairman = 'NEUTRAL';
    card.action(player);
    expect(turmoil.chairman).eq(player.id);
  });

  it('Can only act once per game', function() {
    expect(card.canAct(player)).is.true;
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Cannot take OPG if no delegates in reserve', function() {
    expect(card.canAct(player)).is.true;
    turmoil.delegateReserve.clear();
    expect(card.canAct(player)).is.false;
  });

  it('Cannot take OPG if already chairman', function() {
    expect(card.canAct(player)).is.true;
    turmoil.chairman = player.id;
    expect(card.canAct(player)).is.false;
  });


  it('OPG Counts for POLITICAN Award', function() {
    const politician = new Politician();
    game.awards = [];
    game.awards.push(politician);
    const preOPGScore = game.awards[0].getScore(player);
    card.action(player);
    expect(game.awards[0].getScore(player)).eq(preOPGScore+1);
  });
});
