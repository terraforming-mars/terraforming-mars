import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {MarsUniversity} from '../../../src/cards/base/MarsUniversity';
import {OlympusConference} from '../../../src/cards/base/OlympusConference';
import {Research} from '../../../src/cards/base/Research';
import {AdaptationTechnology} from '../../../src//cards/base/AdaptationTechnology';
import {DeferredActionsQueue} from '../../../src/deferredActions/DeferredActionsQueue';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('OlympusConference', function() {
  let card : OlympusConference; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new OlympusConference();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    player.playedCards.push(card);
    card.play();

    expect(card.getVictoryPoints()).to.eq(1);

    card.onCardPlayed(player, new Bushes());
    expect(game.deferredActions).has.lengthOf(0);

    // No resource
    card.onCardPlayed(player, card);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(1);

    // Resource available
    card.onCardPlayed(player, card);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
    orOptions.options[1].cb();
    expect(card.resourceCount).to.eq(2);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('including this', function() {
    player.cardsInHand = [card];
    player.playCard(card, undefined);
    expect(card.resourceCount).to.eq(0);
    TestingUtils.runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('Plays twice for Research', function() {
    player.playedCards.push(card);
    card.onCardPlayed(player, new Research());
    expect(game.deferredActions).has.lengthOf(2);

    // No resource, can't draw, resource automatically added
    const input = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(1);

    // Resource on card, can draw
    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.lengthOf(1);

    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Triggers before Mars University', function() {
    const marsUniversity = new MarsUniversity();
    const scienceTagCard = new AdaptationTechnology();

    // Olypus Conference played before Mars University
    player.playedCards.push(card);
    player.playedCards.push(marsUniversity);
    card.resourceCount = 1;

    // Play a 1 science tag card
    player.playCard(scienceTagCard);

    // OC asking to draw & MU asking to discard
    expect(game.deferredActions).has.lengthOf(2);

    // OC's trigger should be the first one
    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
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
    player.playCard(scienceTagCard);

    // OC asking to draw & MU asking to discard
    expect(game.deferredActions).has.lengthOf(2);

    // OC's trigger should be the first one
    const orOptions2 = game.deferredActions.peek()!.execute() as OrOptions;
    game.deferredActions.pop();
    orOptions2.options[1].cb();
    expect(card.resourceCount).to.eq(2);
  });
});
