import {MediaGroup} from '../../../src/cards/base/MediaGroup';
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
import {Tags} from '../../../src/common/cards/Tags';
import {Game} from '../../../src/Game';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';
import {Virus} from '../../../src/cards/base/Virus';
import {TestingUtils} from '../../TestingUtils';

describe('PharmacyUnion', function() {
  let card : PharmacyUnion; let player : Player; let player2 : Player;

  beforeEach(function() {
    card = new PharmacyUnion();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);

    player.corporationCard = card;
  });

  it('Should play', function() {
    Game.newInstance('foobar', [player], player);
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
    card.play(player);

    const ants = new Ants();
    player.playedCards.push(ants);
    card.onCardPlayed(player, ants);
    player.game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(card.resourceCount).to.eq(3);
    expect(player.megaCredits).to.eq(4);

    const viralEnhancers = new ViralEnhancers();
    player2.playedCards.push(viralEnhancers);
    card.onCardPlayed(player2, viralEnhancers);
    player.game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(player2.megaCredits).to.eq(8); // should not change
    expect(card.resourceCount).to.eq(4);
    expect(player.megaCredits).to.eq(0);
  });

  it('Removes diseases and gives TR only when corp owner plays science cards', function() {
    card.play(player);

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    card.onCardPlayed(player, searchForLife);
    expect(player.game.deferredActions).has.lengthOf(1);
    expect(player.game.deferredActions.peek()!.execute()).is.undefined;
    player.game.deferredActions.pop();

    expect(card.resourceCount).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);

    const lagrangeObservatory = new LagrangeObservatory();
    player2.playedCards.push(lagrangeObservatory);
    card.onCardPlayed(player2, lagrangeObservatory);
    expect(player.game.deferredActions).has.lengthOf(0);
    expect(card.resourceCount).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Works correctly with Research', function() {
    card.play(player);
    expect(card.resourceCount).to.eq(2);

    const research = new Research();
    player.playedCards.push(research);
    card.onCardPlayed(player, research);
    expect(player.game.deferredActions).has.lengthOf(2);
    expect(player.game.deferredActions.peek()!.execute()).is.undefined;
    player.game.deferredActions.pop();
    expect(player.game.deferredActions.peek()!.execute()).is.undefined;
    player.game.deferredActions.pop();

    expect(card.resourceCount).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });

  it('Can turn card face down once per game to gain 3 TR if no diseases on card', function() {
    card.resourceCount = 0;

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    card.onCardPlayed(player, searchForLife);
    expect(player.game.deferredActions).has.lengthOf(1);
    expect(player.getPlayedEventsCount()).to.eq(0);

    const orOptions = player.game.deferredActions.peek()!.execute() as OrOptions;
    player.game.deferredActions.pop();
    orOptions.options[0].cb();

    expect(player.getTerraformRating()).to.eq(23);
    expect(card.isDisabled).is.true;
    expect(player.getPlayedEventsCount()).to.eq(1); // Counts as a played event

    // Cannot trigger once per game effect a second time
    card.onCardPlayed(player, searchForLife);
    expect(player.game.deferredActions).has.lengthOf(0);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Corporation tags do not count when corporation is disabled', function() {
    expect(player.getTagCount(Tags.MICROBE)).to.eq(2);
    const advancedEcosystems = new AdvancedEcosystems();
    player.playedCards.push(new Fish());
    player.playedCards.push(new Lichen());
    expect(player.canPlayIgnoringCost(advancedEcosystems)).is.true;

    card.resourceCount = 0;
    card.onCardPlayed(player, new SearchForLife());

    const orOptions = player.game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[0].cb();
    expect(card.isDisabled).is.true;
    expect(player.getTagCount(Tags.MICROBE)).to.eq(0);
    expect(player.canPlayIgnoringCost(advancedEcosystems)).is.not.true;
  });

  it('Edge Case - Let player pick the tag resolution order', function() {
    // Edge case, let player pick order of resolution
    // see https://github.com/bafolts/terraforming-mars/issues/1286

    player.megaCredits = 12;
    const viralEnhancers = new ViralEnhancers();

    // Another player playing a Science/Microbes card and Pharmacy Union has no resource
    card.resourceCount = 0;
    player2.playedCards.push(viralEnhancers);
    card.onCardPlayed(player2, viralEnhancers);
    player.game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(card.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
    expect(player.game.deferredActions).has.lengthOf(0);


    // PU player playing a Science/Microbes card and Pharmacy Union has no resource
    card.resourceCount = 0;
    player.playedCards.push(viralEnhancers);
    card.onCardPlayed(player, viralEnhancers);
    expect(player.game.deferredActions).has.lengthOf(1);

    const orOptions = player.game.deferredActions.peek()!.execute() as OrOptions;
    orOptions.options[1].cb(); // Add disease then remove it
    expect(card.resourceCount).to.eq(0);
    expect(player.megaCredits).to.eq(4);

    orOptions.options[0].cb(); // Turn face down then lose 4MC
    expect(card.isDisabled).is.true;
    expect(card.resourceCount).to.eq(0);
    expect(player.megaCredits).to.eq(0);
  });

  it('Edge case, lose MC before gaining', () => {
    // See https://github.com/terraforming-mars/terraforming-mars/issues/2191
    player.megaCredits = 0;
    player.playedCards = [new MediaGroup()];
    player.playCard(new Virus());
    TestingUtils.runAllActions(player.game);
    expect(player.megaCredits).eq(3);
  });
});
