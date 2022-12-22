import {expect} from "chai";
import {Rogers} from "../../../src/server/cards/leaders/Rogers";
import {IshtarMining} from "../../../src/server/cards/venusNext/IshtarMining";
import {LocalShading} from "../../../src/server/cards/venusNext/LocalShading";
import {VenusGovernor} from "../../../src/server/cards/venusNext/VenusGovernor";
import {VenusianAnimals} from "../../../src/server/cards/venusNext/VenusianAnimals";
import {Game} from "../../../src/server/Game";
import {forceGenerationEnd, setCustomGameOptions} from "../../TestingUtils";
import {TestPlayer} from '../../TestPlayer';


describe('Rogers', function() {
  let card: Rogers;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Rogers();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);
    player.playedCards.push(card);
    player.megaCredits = 30;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes OPG action', function() {
    card.action();
    expect(card.opgActionIsActive).is.true;

    // Has discount of 3 M€ when playing Venus tags
    expect(card.getCardDiscount(player, new LocalShading())).eq(3);
    expect(card.getCardDiscount(player, new VenusGovernor())).eq(6);

    // Can ignore global requirements on Venus cards this generation
    expect(game.getVenusScaleLevel()).eq(0);
    expect(new IshtarMining().canPlay(player)).is.true;
    expect(new VenusianAnimals().canPlay(player)).is.true;
  });

  it('Can only act once per game', function() {
    card.action();
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.opgActionIsActive).is.false;
    expect(card.canAct()).is.false;
  });
});
