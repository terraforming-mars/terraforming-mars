import {expect} from 'chai';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Phase} from '../../../src/common/Phase';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';

import {Greta} from '../../../src/server/cards/ceos/Greta';
import {Omnicourt} from '../../../src/server/cards/venusNext/Omnicourt';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';

describe('Greta', function() {
  let card: Greta;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new Greta();
    [game, player, player2] = testGame(2, {ceoExtension: true});
    player.playCard(card);
  });

  it('Gains 4 M€ per TR raise action when OPG action is used', function() {
    // doesnt gain before card action
    runAllActions(game);
    game.phase = Phase.ACTION;

    player.playCard(new BigAsteroid());
    expect(player.megaCredits).to.eq(0);

    card.action();

    player.game.increaseOxygenLevel(player, 1);
    expect(player.megaCredits).to.eq(4);

    player.game.increaseTemperature(player, 1);
    expect(player.megaCredits).to.eq(8);

    player.game.increaseVenusScaleLevel(player, 1);
    expect(player.megaCredits).to.eq(12);

    player.playCard(new BigAsteroid()); // 2 Temp Steps in ONE ACTION
    expect(player.megaCredits).to.eq(16);

    player.playCard(new Omnicourt()); // 2 Steps in ONE ACTION
    expect(player.megaCredits).to.eq(20);
  });

  it('Does not gain MC after 10 increases', function() {
    // doesnt gain before card action
    runAllActions(game);
    game.phase = Phase.ACTION;
    card.action();
    expect(player.megaCredits).to.eq(0);
    player.game.increaseOxygenLevel(player, 2); // One action, two steps, only 4MC
    player.game.increaseOxygenLevel(player, 1);
    player.game.increaseOxygenLevel(player, 1);
    player.game.increaseOxygenLevel(player, 1);
    player.game.increaseOxygenLevel(player, 1);
    expect(player.megaCredits).to.eq(20);
    player.game.increaseTemperature(player, 2); // One action, two steps, only 4MC
    player.game.increaseTemperature(player, 1);
    player.game.increaseTemperature(player, 1);
    player.game.increaseTemperature(player, 1);
    player.game.increaseTemperature(player, 1);
    expect(player.megaCredits).to.eq(40);
    player.game.increaseTemperature(player, 2); // 10 increases already, no more bonuses
    expect(player.megaCredits).to.eq(40);
  });


  it('Can only act once per game, no income when not active', function() {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 0;
    player.game.increaseVenusScaleLevel(player, 1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Does not gain 4MC from TR bonus when the winning Chairman', function() {
    [game, player, player2] = testGame(2, {turmoilExtension: true, ceoExtension: true});
    turmoil = game.turmoil!;
    turmoil.parties.forEach((p) => p.delegates.clear());
    player.playCard(card);
    player.setTerraformRating(20);
    player2.setTerraformRating(20);
    player.megaCredits = 0;
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);

    card.action();
    turmoil.endGeneration(game);
    runAllActions(game);
    expect(turmoil.chairman).to.eq(player);
    expect(player.getTerraformRating()).to.eq(20);
    expect(player.megaCredits).to.eq(0);
    expect(player2.getTerraformRating()).to.eq(19);
    expect(player2.megaCredits).to.eq(0);
  });
});
