import {expect} from 'chai';
import {Rogers} from '../../../src/server/cards/ceos/Rogers';
import {IshtarMining} from '../../../src/server/cards/venusNext/IshtarMining';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {VenusianAnimals} from '../../../src/server/cards/venusNext/VenusianAnimals';
import {Game} from '../../../src/server/Game';
import {forceGenerationEnd} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';


describe('Rogers', function() {
  let card: Rogers;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Rogers();
    game = newTestGame(1, {ceoExtension: true});
    player = getTestPlayer(game, 0);
    player.playedCards.push(card);
    player.megaCredits = 30;
  });

  it('Can only act once per game', function() {
    expect(card.isDisabled).is.false;
    expect(card.canAct(player)).is.true;
    expect(card.opgActionIsActive).is.false;

    card.action();

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
    expect(card.opgActionIsActive).is.true;

    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
    expect(card.opgActionIsActive).is.false;
  });

  it('Takes OPG action, cards discounted', function() {
    // Sanity
    expect(card.getCardDiscount(player, new LocalShading())).eq(0);
    expect(card.getCardDiscount(player, new VenusGovernor())).eq(0);

    card.action();
    expect(card.opgActionIsActive).is.true;

    // Has discount of 3 M€ when playing Venus tags
    expect(card.getCardDiscount(player, new LocalShading())).eq(3);
    expect(card.getCardDiscount(player, new VenusGovernor())).eq(6);
  });

  it('Takes OPG action, ignored global requirements', function() {
    card.action();
    expect(card.opgActionIsActive).is.true;

    // Can ignore global requirements on Venus cards this generation
    expect(game.getVenusScaleLevel()).eq(0);
    expect(new IshtarMining().canPlay(player)).is.true;
    expect(new VenusianAnimals().canPlay(player)).is.true;
  });
});
