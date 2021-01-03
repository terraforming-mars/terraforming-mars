import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/cards/base/AdvancedEcosystems';
import {Ants} from '../../../src/cards/base/Ants';
import {Fish} from '../../../src/cards/base/Fish';
import {LagrangeObservatory} from '../../../src/cards/base/LagrangeObservatory';
import {Lichen} from '../../../src/cards/base/Lichen';
import {Research} from '../../../src/cards/base/Research';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {ViralEnhancers} from '../../../src/cards/base/ViralEnhancers';
import {PharmacyUnion} from '../../../src/cards/promo/PharmacyUnion';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('PharmacyUnion', function() {
  let card : PharmacyUnion; let player : Player; let player2 : Player; let game : Game;

  beforeEach(function() {
    card = new PharmacyUnion();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    player.corporationCard = card;
  });

  it('Should play', function() {
    game = Game.newInstance('foobar', [player], player);
    const pi = player.getWaitingFor() as AndOptions;
    pi.options[0].cb([card]);
    pi.options[1].cb([]);
    pi.cb();

    expect(card.resourceCount).to.eq(2);
    // Should not pay for the free Science card
    expect(player.megaCredits).to.eq(46);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].tags.includes(Tags.SCIENCE)).is.true;
  });

  it('Gains diseases and removes MC when ANY player plays microbe cards', function() {
    player.megaCredits = 8;
    player2.megaCredits = 8;
    card.play(player, game);

    const ants = new Ants();
    player.playedCards.push(ants);
    card.onCardPlayed(player, game, ants);
    game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(card.resourceCount).to.eq(3);
    expect(player.megaCredits).to.eq(4);

    const viralEnhancers = new ViralEnhancers();
    player2.playedCards.push(viralEnhancers);
    card.onCardPlayed(player2, game, viralEnhancers);
    game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(player2.megaCredits).to.eq(8); // should not change
    expect(card.resourceCount).to.eq(4);
    expect(player.megaCredits).to.eq(0);
  });

  it('Removes diseases and gives TR only when corp owner plays science cards', function() {
    card.play(player, game);

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    card.onCardPlayed(player, game, searchForLife);
    expect(game.deferredActions).has.lengthOf(1);
    expect(game.deferredActions.next()!.execute()).is.undefined;
    game.deferredActions.shift();

    expect(card.resourceCount).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);

    const lagrangeObservatory = new LagrangeObservatory();
    player2.playedCards.push(lagrangeObservatory);
    card.onCardPlayed(player2, game, lagrangeObservatory);
    expect(game.deferredActions).has.lengthOf(0);
    expect(card.resourceCount).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Works correctly with Research', function() {
    card.play(player, game);
    expect(card.resourceCount).to.eq(2);

    const research = new Research();
    player.playedCards.push(research);
    card.onCardPlayed(player, game, research);
    expect(game.deferredActions).has.lengthOf(2);
    expect(game.deferredActions.next()!.execute()).is.undefined;
    game.deferredActions.shift();
    expect(game.deferredActions.next()!.execute()).is.undefined;
    game.deferredActions.shift();

    expect(card.resourceCount).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });

  it('Can turn card face down once per game to gain 3 TR if no diseases on card', function() {
    card.resourceCount = 0;

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    card.onCardPlayed(player, game, searchForLife);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    game.deferredActions.shift();
    orOptions.options[0].cb();

    expect(player.getTerraformRating()).to.eq(23);
    expect(card.isDisabled).is.true;

    // Cannot trigger once per game effect a second time
    card.onCardPlayed(player, game, searchForLife);
    expect(game.deferredActions).has.lengthOf(0);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Corporation tags do not count when corporation is disabled', function() {
    expect(player.getTagCount(Tags.MICROBE)).to.eq(2);
    const advancedEcosystems = new AdvancedEcosystems();
    player.playedCards.push(new Fish());
    player.playedCards.push(new Lichen());
    expect(advancedEcosystems.canPlay(player)).is.true;

    card.resourceCount = 0;
    card.onCardPlayed(player, game, new SearchForLife());

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(card.isDisabled).is.true;
    expect(player.getTagCount(Tags.MICROBE)).to.eq(0);
    expect(advancedEcosystems.canPlay(player)).is.not.true;
  });

  it('Edge Case - Let player pick the tag resolution order', function() {
    // Edge case, let player pick order of resolution
    // see https://github.com/bafolts/terraforming-mars/issues/1286

    player.megaCredits = 12;
    const viralEnhancers = new ViralEnhancers();

    // Another player playing a Science/Microbes card and Pharmacy Union has no resource
    card.resourceCount = 0;
    player2.playedCards.push(viralEnhancers);
    card.onCardPlayed(player2, game, viralEnhancers);
    game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
    expect(game.deferredActions).has.lengthOf(0);


    // PU player playing a Science/Microbes card and Pharmacy Union has no resource
    card.resourceCount = 0;
    player.playedCards.push(viralEnhancers);
    card.onCardPlayed(player, game, viralEnhancers);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    orOptions.options[1].cb(); // Add disease then remove it
    expect(card.resourceCount).to.eq(0);
    expect(player.megaCredits).to.eq(4);

    orOptions.options[0].cb(); // Turn face down then lose 4MC
    expect(card.isDisabled).is.true;
    expect(card.resourceCount).to.eq(0);
    expect(player.megaCredits).to.eq(0);
  });
});
