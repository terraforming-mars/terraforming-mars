import {expect} from 'chai';
import {forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Phase} from '../../../src/common/Phase';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';

import {Greta} from '../../../src/server/cards/ceos/Greta';
import {Omnicourt} from '../../../src/server/cards/venusNext/Omnicourt';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';

describe('Greta', function() {
  let card: Greta;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new Greta();
    game = newTestGame(2, {ceoExtension: true});
    player = getTestPlayer(game, 0);
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

    player.playCard(new BigAsteroid()); // 2 Temp Steps
    expect(player.megaCredits).to.eq(20);

    player.playCard(new Omnicourt()); // 2 Steps
    expect(player.megaCredits).to.eq(28);
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
    game = newTestGame(2, {turmoilExtension: true, ceoExtension: true});
    turmoil = game.turmoil!;
    turmoil.parties.forEach((p) => p.delegates.clear());
    player = getTestPlayer(game, 0);
    player.playCard(card);
    player.setTerraformRating(20);
    const player2 = getTestPlayer(game, 1);
    player2.setTerraformRating(20);
    player.megaCredits = 0;
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);

    card.action();
    turmoil.endGeneration(game);
    runAllActions(game);
    expect(turmoil.chairman).to.eq(player.id);
    expect(player.getTerraformRating()).to.eq(20);
    expect(player.megaCredits).to.eq(0);
    expect(player2.getTerraformRating()).to.eq(19);
    expect(player2.megaCredits).to.eq(0);
  });
});
