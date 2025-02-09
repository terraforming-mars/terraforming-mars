import {expect} from 'chai';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Phase} from '../../../src/common/Phase';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Greta} from '../../../src/server/cards/ceos/Greta';
import {Omnicourt} from '../../../src/server/cards/venusNext/Omnicourt';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';
import {Game} from '../../../src/server/Game';

describe('Greta', () => {
  let card: Greta;

  beforeEach(() => {
    card = new Greta();
  });

  it('Gains 4 M€ per TR raise action when OPG action is used', () => {
    const [game, player] = testGame(1, {ceoExtension: true});
    player.playCard(card);

    // doesn't gain before card action
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

  it('Does not gain MC after 10 increases', () => {
    const [game, player] = testGame(1, {ceoExtension: true});
    player.playCard(card);

    // doesn't gain before card action
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


  it('Can only act once per game, no income when not active', () => {
    const [game, player] = testGame(1, {ceoExtension: true});
    player.playCard(card);

    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 0;
    player.game.increaseVenusScaleLevel(player, 1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Does not gain 4MC from TR bonus when the winning Chairman', () => {
    const [game, player, player2] = testGame(2, {ceoExtension: true, turmoilExtension: true});
    const turmoil = game.turmoil!;
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

  it('Survives serialization', () => {
    const [game, player] = testGame(1, {ceoExtension: true});
    player.playCard(card);
    runAllActions(game);

    game.phase = Phase.ACTION;
    card.action();
    expect(card.data.effectTriggerCount).eq(0);
    player.game.increaseOxygenLevel(player, 2); // One action, two steps, only 4MC
    expect(card.data.effectTriggerCount).eq(1);
    player.game.increaseOxygenLevel(player, 1);
    expect(card.data.effectTriggerCount).eq(2);

    const serialized = game.serialize();
    const deserialized = Game.deserialize(serialized);
    const deserailizedCard = deserialized.getPlayers()[0].tableau[0];

    expect(cast(deserailizedCard, Greta).data.effectTriggerCount).eq(2);
  });
});
