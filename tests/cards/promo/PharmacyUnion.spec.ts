import {MediaGroup} from '../../../src/server/cards/base/MediaGroup';
import {expect} from 'chai';
import {AdvancedEcosystems} from '../../../src/server/cards/base/AdvancedEcosystems';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {LagrangeObservatory} from '../../../src/server/cards/base/LagrangeObservatory';
import {Lichen} from '../../../src/server/cards/base/Lichen';
import {Research} from '../../../src/server/cards/base/Research';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {ViralEnhancers} from '../../../src/server/cards/base/ViralEnhancers';
import {PharmacyUnion} from '../../../src/server/cards/promo/PharmacyUnion';
import {Tag} from '../../../src/common/cards/Tag';
import {IGame} from '../../../src/server/IGame';
import {SelectInitialCards} from '../../../src/server/inputs/SelectInitialCards';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {Virus} from '../../../src/server/cards/base/Virus';
import {cast, runAllActions, runNextAction, setOxygenLevel, setRulingParty} from '../../TestingUtils';
import {Player} from '../../../src/server/Player';
import {testGame} from '../../TestGame';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {Splice} from '../../../src/server/cards/promo/Splice';
import {Merger} from '../../../src/server/cards/promo/Merger';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICorporationCard} from '../../../src/server/cards/corporation/ICorporationCard';
import {GMOContract} from '../../../src/server/cards/turmoil/GMOContract';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {SymbioticFungus} from '../../../src/server/cards/base/SymbioticFungus';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {Payment} from '../../../src/common/inputs/Payment';
import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {BuildColonyStandardProject} from '../../../src/server/cards/colonies/BuildColonyStandardProject';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

describe('PharmacyUnion', () => {
  let pharmacyUnion: PharmacyUnion;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    pharmacyUnion = new PharmacyUnion();
    [game, player, player2] = testGame(2);
    player.corporations.push(pharmacyUnion);
  });

  it('Should play', () => {
    player.corporations.length = 0; // Resetting so when setting the corporation it doesn't do anything flaky.
    [game, player] = testGame(1, {skipInitialCardSelection: false});
    const pi = cast(player.getWaitingFor(), SelectInitialCards);
    pi.options[0].cb([pharmacyUnion]);
    pi.options[1].cb([]);
    pi.cb(undefined);

    expect(pharmacyUnion.resourceCount).to.eq(2);
    // Should not pay for the free Science card
    expect(player.megaCredits).to.eq(46);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].tags.includes(Tag.SCIENCE)).is.true;
  });

  it('Gains diseases and removes MC when ANY player plays microbe cards', () => {
    player.megaCredits = 8;
    player2.megaCredits = 8;
    pharmacyUnion.play(player);
    runAllActions(game);

    const ants = new Ants();
    player.playedCards.push(ants);
    pharmacyUnion.onCardPlayed(player, ants);
    player.game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(pharmacyUnion.resourceCount).to.eq(3);
    expect(player.megaCredits).to.eq(4);

    const viralEnhancers = new ViralEnhancers();
    player2.playedCards.push(viralEnhancers);
    pharmacyUnion.onCardPlayed(player2, viralEnhancers);
    player.game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(player2.megaCredits).to.eq(8); // should not change
    expect(pharmacyUnion.resourceCount).to.eq(4);
    expect(player.megaCredits).to.eq(0);
  });

  it('Removes diseases and gives TR only when corp owner plays science cards', () => {
    pharmacyUnion.play(player);
    runAllActions(game);

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    pharmacyUnion.onCardPlayed(player, searchForLife);
    expect(player.game.deferredActions).has.lengthOf(1);
    expect(player.game.deferredActions.peek()!.execute()).is.undefined;
    player.game.deferredActions.pop();

    expect(pharmacyUnion.resourceCount).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);

    const lagrangeObservatory = new LagrangeObservatory();
    player2.playedCards.push(lagrangeObservatory);
    pharmacyUnion.onCardPlayed(player2, lagrangeObservatory);
    expect(player.game.deferredActions).has.lengthOf(0);
    expect(pharmacyUnion.resourceCount).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Works correctly with Research', () => {
    pharmacyUnion.play(player);
    runAllActions(game);

    expect(pharmacyUnion.resourceCount).to.eq(2);

    const research = new Research();
    player.playedCards.push(research);
    pharmacyUnion.onCardPlayed(player, research);
    expect(player.game.deferredActions).has.lengthOf(2);
    expect(player.game.deferredActions.peek()!.execute()).is.undefined;
    player.game.deferredActions.pop();
    expect(player.game.deferredActions.peek()!.execute()).is.undefined;
    player.game.deferredActions.pop();

    expect(pharmacyUnion.resourceCount).to.eq(0);
    expect(player.getTerraformRating()).to.eq(22);
  });

  it('Can turn card face down once per game to gain 3 TR if no diseases on card', () => {
    pharmacyUnion.resourceCount = 0;

    const searchForLife = new SearchForLife();
    player.playedCards.push(searchForLife);
    pharmacyUnion.onCardPlayed(player, searchForLife);
    expect(player.game.deferredActions).has.lengthOf(1);
    expect(player.getPlayedEventsCount()).to.eq(0);

    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    player.game.deferredActions.pop();
    orOptions.options[0].cb();

    expect(player.getTerraformRating()).to.eq(23);
    expect(pharmacyUnion.isDisabled).is.true;
    expect(player.getPlayedEventsCount()).to.eq(1); // Counts as a played event

    // Cannot trigger once per game effect a second time
    pharmacyUnion.onCardPlayed(player, searchForLife);
    expect(player.game.deferredActions).has.lengthOf(0);
    expect(player.getTerraformRating()).to.eq(23);
  });

  it('Corporation tags do not count when corporation is disabled', () => {
    expect(player.tags.count(Tag.MICROBE)).to.eq(2);
    const advancedEcosystems = new AdvancedEcosystems();
    player.playedCards.push(new Fish());
    player.playedCards.push(new Lichen());
    expect(advancedEcosystems.canPlay(player)).is.true;

    pharmacyUnion.resourceCount = 0;
    pharmacyUnion.onCardPlayed(player, new SearchForLife());

    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(pharmacyUnion.isDisabled).is.true;
    expect(player.tags.count(Tag.MICROBE)).to.eq(0);
    expect(advancedEcosystems.canPlay(player)).is.not.true;
  });

  it('Edge Case - Let player pick the tag resolution order', () => {
    // Edge case, let player pick order of resolution
    // see https://github.com/bafolts/terraforming-mars/issues/1286

    player.megaCredits = 12;
    const viralEnhancers = new ViralEnhancers();

    // Another player playing a Science/Microbes card and Pharmacy Union has no resource
    pharmacyUnion.resourceCount = 0;
    player2.playedCards.push(viralEnhancers);
    pharmacyUnion.onCardPlayed(player2, viralEnhancers);
    player.game.deferredActions.runNext(); // Add microbe and lose 4 MC
    expect(pharmacyUnion.resourceCount).to.eq(1);
    expect(player.megaCredits).to.eq(8);
    expect(player.game.deferredActions).has.lengthOf(0);


    // PU player playing a Science/Microbes card and Pharmacy Union has no resource
    pharmacyUnion.resourceCount = 0;
    player.playedCards.push(viralEnhancers);
    pharmacyUnion.onCardPlayed(player, viralEnhancers);
    expect(player.game.deferredActions).has.lengthOf(1);

    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[1].cb(); // Add disease then remove it
    expect(pharmacyUnion.resourceCount).to.eq(0);
    expect(player.megaCredits).to.eq(4);

    orOptions.options[0].cb(); // Turn face down then lose 4MC
    expect(pharmacyUnion.isDisabled).is.true;
    expect(pharmacyUnion.resourceCount).to.eq(0);
    expect(player.megaCredits).to.eq(0);
  });

  it('Edge case, lose MC before gaining', () => {
    // See https://github.com/terraforming-mars/terraforming-mars/issues/2191
    player.megaCredits = 0;
    player.playedCards = [new MediaGroup()];
    player.playCard(new Virus());
    runAllActions(player.game);
    expect(player.megaCredits).eq(3);
  });

  it('serialization test for Player with Pharmacy Union, when false', () => {
    pharmacyUnion.play(player);
    pharmacyUnion.isDisabled = false;
    const serializedPlayer = player.serialize();

    expect(serializedPlayer.corporations?.[0].isDisabled).is.false;

    const reserializedPlayer = Player.deserialize(serializedPlayer);
    const reserializedPharmacyUnion = cast(reserializedPlayer.corporations?.[0], PharmacyUnion);
    expect(reserializedPharmacyUnion.isDisabled).is.false;
  });

  it('serialization test for Player with Pharmacy Union, when true', () => {
    pharmacyUnion.isDisabled = true;
    const serializedPlayer = player.serialize();

    expect(serializedPlayer.corporations?.[0].isDisabled).is.true;

    const reserializedPlayer = Player.deserialize(serializedPlayer);
    const reserializedPharmacyUnion = cast(reserializedPlayer.corporations?.[0], PharmacyUnion);
    expect(reserializedPharmacyUnion.isDisabled).is.true;
  });

  it('Compatible with Leavitt #6349', () => {
    pharmacyUnion.resourceCount = 2;

    const leavitt = new Leavitt();
    leavitt.addColony(player);

    runAllActions(game);

    expect(pharmacyUnion.resourceCount).to.eq(1);
    expect(player.getTerraformRating()).to.eq(21);
  });

  describe('Prioritize effect order', () => {
    it('Compatible with Splice', () => {
      const card = new PharmacyUnion();
      const [/* game */, player, player2] = testGame(2);

      player2.playCorporationCard(new Splice());

      expect(player2.megaCredits).eq(48);

      player.playCorporationCard(card);

      // PU starts with 46, gains 4 from Splice
      expect(player.megaCredits).eq(50);
      // Splice starts with 48, gains 4 from PU
      expect(player2.megaCredits).eq(52);
    });

    it('Merge with Splice', () => {
      const card = new PharmacyUnion();
      const [game, player/* , player2 */] = testGame(2);

      player.playCorporationCard(new Splice());

      // Splice starts with 48
      expect(player.megaCredits).eq(48);

      player.playCard(new Merger());
      runAllActions(game);

      const selectCorp = cast(player.popWaitingFor(), SelectCard<ICorporationCard>);
      selectCorp.cb([card]);
      runAllActions(game);

      //   48      // Splice value
      // - 42 = 6  // Merger cost
      // + 46 = 52 // Pharmacy Union MC
      // +  8 = 60 // Splice rewards.
      // PU costs already taken accounted for. See card for details.
      expect(player.megaCredits).eq(60);
    });
  });

  it('Splice + PU during gameplay', () => {
    const card = new PharmacyUnion();
    const [game, player/* , player2 */] = testGame(2);

    // The test should have Splice first. I think it's not vital, but
    // that's how onCardPlayed actions are resolved.
    player.corporations.push(new Splice(), card);

    player.megaCredits = 1;
    // Symbiotic Fungus has a microbe tag, and doesn't hold microbes, which simplifies Splice's decision.
    // And is actually the case where Pharmacy Union was not working out.
    player.playCard(new SymbioticFungus());

    // Expect this to be the PU action.
    game.deferredActions.runNext();
    expect(player.megaCredits).eq(0);
    cast(player.popWaitingFor(), undefined);

    game.deferredActions.runNext();
    cast(player.popWaitingFor(), undefined);

    game.deferredActions.runNext();
    cast(player.popWaitingFor(), undefined);

    expect(game.deferredActions).has.length(0);

    expect(player.megaCredits).eq(4);
  });

  it('Compatible with GMO Contract', () => {
    const card = new PharmacyUnion();
    const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});

    player.corporations.push(card);
    player.playedCards.push(new GMOContract());
    player.megaCredits = 2;
    player.playCard(new Tardigrades());

    runAllActions(game);

    // Gained 2MC from GMO which it did not lose because PU went first.
    expect(player.megaCredits).eq(2);
  });

  it('Compatible with Greens policy gp03', () => {
    const card = new PharmacyUnion();
    const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});

    player.corporations.push(card);
    setRulingParty(game, PartyName.GREENS, 'gp03');
    player.megaCredits = 2;
    player.playCard(new Tardigrades());

    runAllActions(game);

    // Gained 2MC from gp03 which it did not lose because PU went first.
    expect(player.megaCredits).eq(2);
  });

  it('Pharmacy Union, Splice, Reds, Microbe tag, Science tag #3126', () => {
    const pharmacyUnion = new PharmacyUnion();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});

    player.corporations.push(pharmacyUnion);
    player.megaCredits = 12;
    pharmacyUnion.resourceCount = 1;

    player2.corporations.push(new Splice());

    setRulingParty(game, PartyName.REDS);

    const ghgProducingBacteria = new GHGProducingBacteria();
    player.cardsInHand.push(ghgProducingBacteria);
    setOxygenLevel(game, 4); // GHG Producing Bacteria requirement

    // writeFileSync('db/files/game-id.json', JSON.stringify(game.serialize()));

    // Play GHG Producing Bacteria, triggering the effects.
    expect(player.canPlay(ghgProducingBacteria)).deep.eq({redsCost: 3});
    player.playCard(ghgProducingBacteria, Payment.of({megaCredits: 8}));
    expect(player.megaCredits).eq(4);

    // Pharmacy Union science tag benefit.
    runNextAction(game);
    expect(player.megaCredits).eq(4);
    expect(player.getTerraformRating()).eq(20);

    // Pay for the reds cost and gain TR benefit
    runNextAction(game);
    expect(player.megaCredits).eq(1);
    expect(player.getTerraformRating()).eq(21);

    // Plays the microbe tag cost, costs 4MC, player no longer has money
    runNextAction(game);
    expect(player.megaCredits).eq(0);

    // Start Splice benefit
    expect(player2.megaCredits).eq(0);
    // Player can put a resource on GHG Producing Bacteria, but instead gets the money.
    const orOptions = cast(runNextAction(game), OrOptions);
    orOptions.options[1].cb();

    // Players gain MC from Splice
    runNextAction(game);
    runNextAction(game);
    expect(player2.megaCredits).eq(2);
    expect(player.megaCredits).eq(2);

    // And that's it.
    expect(game.deferredActions).has.length(0);
  });

  it('Reds + Science, #1670', () => {
    const pharmacyUnion = new PharmacyUnion();
    const [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});
    pharmacyUnion.resourceCount = 2;
    player.corporations = [pharmacyUnion];

    player.megaCredits = 12;

    const advancedAlloys = new AdvancedAlloys();

    player.megaCredits = 9; // advanced alloys cost.
    expect(player.canPlay(advancedAlloys)).is.true;

    setRulingParty(game, PartyName.REDS);

    expect(player.canPlay(advancedAlloys)).is.false;

    player.megaCredits += 4;

    expect(player.canPlay(advancedAlloys)).deep.eq({redsCost: 3});

    player.playCard(advancedAlloys, Payment.of({megaCredits: 9}));

    expect(player.megaCredits).eq(4);

    // Pharmacy Union science tag benefit lines up the TR bump.
    runNextAction(game);
    expect(player.megaCredits).eq(4);
    expect(player.getTerraformRating()).eq(20);

    // // Pay for the reds cost and gain TR benefit
    runNextAction(game);
    expect(player.megaCredits).eq(1);
    expect(player.getTerraformRating()).eq(21);

    // And that's it.
    expect(game.deferredActions).has.length(0);
  });

  it('Reds + Leavitt + Pharmacy Union, #1670', () => {
    const pharmacyUnion = new PharmacyUnion();
    const leavitt = new Leavitt();
    const [game, player/* , player2 */] = testGame(2, {coloniesExtension: true, turmoilExtension: true});
    pharmacyUnion.resourceCount = 2;
    player.corporations = [pharmacyUnion];

    game.colonies.push(leavitt);

    player.megaCredits = 17;
    setRulingParty(game, PartyName.REDS);

    const buildColonyStandardProject = new BuildColonyStandardProject();
    buildColonyStandardProject.action(player);
    runAllActions(game);

    expect(cast(player.popWaitingFor(), SelectColony).colonies).does.not.include(leavitt);

    player.megaCredits = 20;
    buildColonyStandardProject.action(player);
    runAllActions(game);

    expect(player.tags.count(Tag.SCIENCE)).eq(0);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).includes(leavitt);
    selectColony.cb(leavitt);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.tags.count(Tag.SCIENCE)).eq(1);
    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
  });
});
