import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {MarsUniversity} from '../../../src/cards/base/MarsUniversity';
import {OlympusConference} from '../../../src/cards/base/OlympusConference';
import {Research} from '../../../src/cards/base/Research';
import {ScienceTagCard} from '../../../src/cards/community/ScienceTagCard';
import {DeferredActionsQueue} from '../../../src/deferredActions/DeferredActionsQueue';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('OlympusConference', function() {
  let card : OlympusConference; let player : Player; let game : Game;

  beforeEach(function() {
    card = new OlympusConference();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    player.playedCards.push(card);
    card.play();

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);

    card.onCardPlayed(player, game, new Bushes());
    expect(game.deferredActions).has.lengthOf(0);

    // No resource
    card.onCardPlayed(player, game, card);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.next()!.execute();
    game.deferredActions.shift();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(1);

    // Resource available
    card.onCardPlayed(player, game, card);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions.options[1].cb();
    expect(card.resourceCount).to.eq(2);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Plays twice for Research', function() {
    player.playedCards.push(card);
    card.onCardPlayed(player, game, new Research());
    expect(game.deferredActions).has.lengthOf(2);

    // No resource, can't draw, resource automatically added
    const input = game.deferredActions.next()!.execute();
    game.deferredActions.shift();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(1);

    // Resource on card, can draw
    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);

    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Triggers before Mars University', function() {
    const marsUniversity = new MarsUniversity();
    const scienceTagCard = new ScienceTagCard();

    // Olypus Conference played before Mars University
    player.playedCards.push(card);
    player.playedCards.push(marsUniversity);
    card.resourceCount = 1;

    // Play a 1 science tag card
    player.playCard(game, scienceTagCard);

    // OC asking to draw & MU asking to discard
    expect(game.deferredActions).has.lengthOf(2);

    // OC's trigger should be the first one
    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions.options[1].cb();
    expect(card.resourceCount).to.eq(2);


    // Reset the state
    game.deferredActions = new DeferredActionsQueue();
    player.playedCards = [];


    // Mars University played before Olympus Conference
    player.playedCards.push(marsUniversity);
    player.playedCards.push(card);
    card.resourceCount = 1;

    // Play a 1 science tag card
    player.playCard(game, scienceTagCard);

    // OC asking to draw & MU asking to discard
    expect(game.deferredActions).has.lengthOf(2);

    // OC's trigger should be the first one
    const orOptions2 = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions2.options[1].cb();
    expect(card.resourceCount).to.eq(2);
  });
});
