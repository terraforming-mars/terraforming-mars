import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {SmallAnimals} from '../../../src/server/cards/base/SmallAnimals';
import {CardType} from '../../../src/common/cards/CardType';
import {ProjectWorkshop} from '../../../src/server/cards/community/ProjectWorkshop';
import {ICard} from '../../../src/server/cards/ICard';
import {Extremophiles} from '../../../src/server/cards/venusNext/Extremophiles';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {TestPlayer} from '../../TestPlayer';
import {AncientShipyards} from '../../../src/server/cards/moon/AncientShipyards';
import {cast, runAllActions} from '../../TestingUtils';
import {Phase} from '../../../src/common/Phase';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';

describe('ProjectWorkshop', function() {
  let card: ProjectWorkshop;
  let player: TestPlayer;
  let game: Game;
  let advancedAlloys : AdvancedAlloys;

  beforeEach(function() {
    card = new ProjectWorkshop();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    advancedAlloys = new AdvancedAlloys();

    card.play(player);
    player.setCorporationForTest(card);
  });

  it('Starts with correct resources', function() {
    expect(player.steel).to.eq(1);
    expect(player.titanium).to.eq(1);

    card.initialAction(player);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].cardType).to.eq(CardType.ACTIVE);
  });

  it('Can not act', function() {
    player.megaCredits = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can spend 3 M€ to draw a blue card', function() {
    player.megaCredits = 3;

    expect(card.canAct(player)).is.true;
    card.action(player).cb();
    runAllActions(game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].cardType).to.eq(CardType.ACTIVE);
  });

  it('Can flip a played blue card and remove its ongoing effects', function() {
    player.playedCards.push(advancedAlloys);
    advancedAlloys.play(player);
    player.megaCredits = 0;

    expect(player.getSteelValue()).to.eq(3);
    expect(player.getTitaniumValue()).to.eq(4);

    card.action(player).cb();
    expect(player.playedCards).has.lengthOf(0);
    expect(game.projectDeck.discardPile.includes(advancedAlloys)).is.true;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.getSteelValue()).to.eq(2);
    expect(player.getTitaniumValue()).to.eq(3);
  });

  it('Converts VP to TR correctly', function() {
    const smallAnimals = new SmallAnimals();
    player.addResourceTo(smallAnimals, 5);

    const extremophiles = new Extremophiles();
    player.addResourceTo(extremophiles, 11);

    const originalTR = player.getTerraformRating();
    player.playedCards.push(smallAnimals, extremophiles);

    const selectOption = cast(card.action(player), SelectOption);
    const selectCard = cast(selectOption.cb(), SelectCard<ICard>);

    selectCard.cb([smallAnimals]);
    expect(player.getTerraformRating()).to.eq(originalTR + 2);
    expect(player.cardsInHand).has.lengthOf(2);

    selectCard.cb([extremophiles]);
    expect(player.getTerraformRating()).to.eq(originalTR + 5);
    expect(player.cardsInHand).has.lengthOf(4);
  });

  it('Can select option if able to do both actions', function() {
    player.playedCards.push(advancedAlloys);
    player.megaCredits = 3;
    // That the response is OrOptions is the test.
    cast(card.action(player), OrOptions);
  });

  it('Project Workshop removes TR when flipping Ancient Shipyards', () => {
    const ancientShipyards = new AncientShipyards();
    player.addResourceTo(ancientShipyards, 5);

    const originalTR = player.getTerraformRating();
    player.playedCards.push(ancientShipyards);

    const selectOption = cast(card.action(player), SelectOption);

    expect(selectOption.cb()).is.undefined;
    expect(player.playedCards).is.empty;

    expect(player.getTerraformRating()).to.eq(originalTR - 5);
    expect(player.cardsInHand).has.lengthOf(2);
  });


  it('Project Workshop and Reds taxes', () => {
    game = newTestGame(1, {turmoilExtension: true});
    const player = getTestPlayer(game, 0);
    card.play(player);
    player.setCorporationForTest(card);
    player.game.phase = Phase.ACTION;

    const turmoil = game.turmoil!;
    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    const smallAnimals = new SmallAnimals();
    player.addResourceTo(smallAnimals, 4);
    expect(smallAnimals.getVictoryPoints(player)).eq(2);

    const extremophiles = new Extremophiles();
    player.addResourceTo(extremophiles, 9);
    expect(extremophiles.getVictoryPoints(player)).eq(3);

    const birds = new Birds();
    birds.resourceCount = 1;
    expect(birds.getVictoryPoints()).eq(1);

    player.playedCards.push(smallAnimals, extremophiles, birds);

    const selectCard = function() {
      const orOptions = cast(card.action(player), OrOptions);
      return cast(orOptions.options[1].cb(), SelectCard);
    };

    player.megaCredits = 9;
    expect(selectCard().cards).has.members([smallAnimals, extremophiles, birds]);

    player.megaCredits = 8;
    expect(selectCard().cards).has.members([smallAnimals, birds]);

    player.megaCredits = 6;
    expect(selectCard().cards).has.members([smallAnimals, birds]);

    const originalTR = player.getTerraformRating();
    player.megaCredits = 5;

    const orOptions = cast(card.action(player), OrOptions);
    expect(orOptions.options[1].cb()).is.undefined;
    runAllActions(game);

    expect(player.playedCards).has.members([smallAnimals, extremophiles]);
    expect(game.projectDeck.discardPile).contains(birds);
    expect(player.getTerraformRating()).to.eq(originalTR + 1);
    expect(player.megaCredits).eq(2); // Spent 3MC for the reds tax.
  });

  it('Project Workshop + Helion', function() {
    const helion = new Helion();
    helion.play(player);
    player.corporations.push(helion);

    player.megaCredits = 2;
    expect(card.canAct(player)).is.false;
    player.heat = 1;
    expect(card.canAct(player)).is.true;

    // Setting a larger amount of heat just to make the test results more interesting
    player.heat = 5;

    card.action(player).cb();
    runAllActions(game);
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb({...Payment.EMPTY, megaCredits: 1, heat: 2});
    expect(player.megaCredits).to.eq(1);
    expect(player.heat).to.eq(3);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].cardType).to.eq(CardType.ACTIVE);
  });
});
