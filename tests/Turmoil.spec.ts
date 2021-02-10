import {expect} from 'chai';
import {Player} from '../src/Player';
import {PartyName} from '../src/turmoil/parties/PartyName';
import {Game} from '../src/Game';
import {MarsFirst} from '../src/turmoil/parties/MarsFirst';
import {Phase} from '../src/Phase';
import {OrOptions} from '../src/inputs/OrOptions';
import {SelectSpace} from '../src/inputs/SelectSpace';
import {SpaceBonus} from '../src/SpaceBonus';
import {Turmoil} from '../src/turmoil/Turmoil';
import {TestingUtils, setCustomGameOptions, TestPlayers} from './TestingUtils';
import {Reds} from '../src/turmoil/parties/Reds';
import {ReleaseOfInertGases} from '../src/cards/base/ReleaseOfInertGases';
import {JovianEmbassy} from '../src/cards/promo/JovianEmbassy';
import {IceAsteroid} from '../src/cards/base/IceAsteroid';
import {ProtectedValley} from '../src/cards/base/ProtectedValley';
import {MagneticFieldGeneratorsPromo} from '../src/cards/promo/MagneticFieldGeneratorsPromo';
import {Resources} from '../src/Resources';
import {NitrogenFromTitan} from '../src/cards/colonies/NitrogenFromTitan';
import {SpaceStation} from '../src/cards/base/SpaceStation';
import {EarthCatapult} from '../src/cards/base/EarthCatapult';
import {QuantumExtractor} from '../src/cards/base/QuantumExtractor';
import * as constants from '../src/constants';
import {SerializedTurmoil} from '../src/turmoil/SerializedTurmoil';
import {PoliticalAgendas} from '../src/turmoil/PoliticalAgendas';
import {IParty} from '../src/turmoil/parties/IParty';
import {GreeneryStandardProject} from '../src/cards/base/standardProjects/GreeneryStandardProject';

describe('Turmoil', function() {
  let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();

    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    game.phase = Phase.ACTION;
    turmoil = game.turmoil!;
    TestingUtils.resetBoard(game);
  });

  it('Should initialize with right defaults', function() {
    expect(turmoil.chairman).to.eq('NEUTRAL');
    expect(turmoil.rulingParty.name).to.eq(PartyName.GREENS);
  });

  it('Correctly send delegate', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.delegates = [];

    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    expect(greens.delegates).has.lengthOf(1);
    expect(game.getPlayerById(greens.delegates[0])).to.eq(player);
  });

  it('Counts influence correctly for dominant party', function() {
    turmoil.parties.forEach((party) => party.delegates = []);

    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    expect(greens.delegates).has.lengthOf(1);

    // 1 influence: Leader of dominant party
    const greensPartyLeader = game.getPlayerById(greens.partyLeader!);
    expect(greensPartyLeader).to.eq(player);
    expect(turmoil.getPlayerInfluence(player)).to.eq(1);

    // 2 influence: Leader of dominant party + at least 1 non-leader delegate in party
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    expect(greens.delegates).has.lengthOf(2);
    expect(turmoil.getPlayerInfluence(player)).to.eq(2);
  });

  it('Chairman gives 1 influence', function() {
    turmoil.parties.forEach((party) => party.delegates = []);
    turmoil.chairman = player.id;
    expect(turmoil.getPlayerInfluence(player)).to.eq(1);
  });

  it('Correctly set dominant party', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    greens.delegates = [];
    reds.delegates = [];

    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    expect(turmoil.dominantParty).to.eq(greens);

    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    expect(turmoil.dominantParty).to.eq(greens);

    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    expect(turmoil.dominantParty).to.eq(reds);
  });

  it('Correctly set party leader', function() {
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    expect(game.getPlayerById(turmoil.getPartyByName(PartyName.GREENS)!.partyLeader!)).to.eq(player);
  });

  it('Correctly run end of generation', function() {
    // Eliminate the flaky cases where the current global event sends delegates to
    // parties, changing the dominant party outcome.
    turmoil.parties.forEach((p) => p.delegates = []);

    player.setTerraformRating(20);
    player2.setTerraformRating(21);

    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);

    game.phase = Phase.SOLAR;
    turmoil.endGeneration(game);

    expect(game.getPlayerById(turmoil.chairman!)).to.eq(player);
    // both players lose 1 TR; player gains 1 TR from Reds ruling bonus, 1 TR from chairman
    expect(player.getTerraformRating()).to.eq(21);
    expect(player2.getTerraformRating()).to.eq(20);

    expect(turmoil.lobby.size).to.eq(2);
    expect(turmoil.rulingParty).to.eq(turmoil.getPartyByName(PartyName.REDS));
    expect(turmoil.dominantParty).to.eq(turmoil.getPartyByName(PartyName.GREENS));
  });

  it('Does not give Mars First bonus for World Government terraforming', function() {
    setRulingParty(turmoil, game, new MarsFirst());
    game.phase = Phase.SOLAR;

    player.worldGovernmentTerraforming();
    const action = player.getWaitingFor() as OrOptions;
    const placeOcean = action.options.find((option) => option.title === 'Add an ocean') as SelectSpace;
    const steelSpace = placeOcean.availableSpaces.find((space) => space.bonus.includes(SpaceBonus.STEEL));

    placeOcean.cb(steelSpace!);
    expect(player.steel).to.eq(0); // should not give ruling policy bonus
  });

  it('Can\'t raise TR via Standard Projects if Reds are ruling and player cannot pay', function() {
    setRulingParty(turmoil, game, new Reds());
    player.megaCredits = 14;
    const standardProjects = player.getStandardProjectOption();

    // can only use Power Plant as cannot pay 3 for Reds ruling policy
    expect(standardProjects.enabled![0]).to.eq(true);
    expect(standardProjects.enabled!.slice(1)).to.not.contain(true);
  });

  it('Can do SP greenery at normal cost if Reds are ruling and oxygen is maxed', function() {
    setRulingParty(turmoil, game, new Reds());
    player.megaCredits = 23;
    expect(new GreeneryStandardProject().canAct(player)).equal(false);

    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL;
    expect(new GreeneryStandardProject().canAct(player)).equal(true);
  });

  it('Can\'t play cards to raise TR directly if Reds are ruling and player cannot pay', function() {
    setRulingParty(turmoil, game, new Reds());
    player.megaCredits = 16;
    const releaseOfInertGases = new ReleaseOfInertGases();
    const jovianEmbassy = new JovianEmbassy();

    expect(releaseOfInertGases.canPlay(player)).is.not.true; // needs 20 MC
    expect(jovianEmbassy.canPlay(player)).is.not.true; // needs 17 MC

    player.addProduction(Resources.ENERGY, 4);
    player.megaCredits = 30;
    const magneticFieldGeneratorsPromo = new MagneticFieldGeneratorsPromo();
    expect(magneticFieldGeneratorsPromo.canPlay(player)).is.not.true; // needs 31 MC
  });

  it('Can\'t play cards to raise TR via global parameters if Reds are ruling and player cannot pay', function() {
    setRulingParty(turmoil, game, new Reds());
    player.megaCredits = 25;
    const iceAsteroid = new IceAsteroid();
    const protectedValley = new ProtectedValley();

    expect(iceAsteroid.canPlay(player)).is.not.true; // needs 29 MC
    expect(protectedValley.canPlay(player)).is.not.true; // needs 26 MC

    // can play if won't gain TR from raising global parameter
    TestingUtils.maxOutOceans(player, 9);
    expect(protectedValley.canPlay(player)).is.true;
    expect(iceAsteroid.canPlay(player)).is.true;
  });

  it('Applies card discounts when checking canPlay while Reds are ruling', function() {
    setRulingParty(turmoil, game, new Reds());
    const nitrogenFromTitan = new NitrogenFromTitan();

    player.megaCredits = 29;
    expect(nitrogenFromTitan.canPlay(player)).is.not.true; // needs 31 MC

    player.playedCards.push(new SpaceStation());
    expect(nitrogenFromTitan.canPlay(player)).is.true; // 25 + 6 - 2

    player.playedCards.push(new EarthCatapult(), new QuantumExtractor());
    player.megaCredits = 25;
    expect(nitrogenFromTitan.canPlay(player)).is.true; // 25 + 6 - 6
  });

  it('backward compatible deserialization', () => {
    const json = {
      'chairman': 'NEUTRAL',
      'rulingParty': {'delegates': ['blue-id', 'NEUTRAL'], 'name': 'Greens', 'description': 'All players receive 1 MC for each Plant tag, Microbe tag, and Animal tag they have.'},
      'dominantParty': {'partyLeader': 'NEUTRAL', 'delegates': ['NEUTRAL'], 'name': 'Unity', 'description': 'All players receive 1 MC for each Venus tag, Earth tag, and Jovian tag they have.'},
      'lobby': ['blue-id'],
      'delegate_reserve': ['blue-id', 'red-id', 'green-id', 'NEUTRAL', 'NEUTRAL'],
      'parties': [
        {'partyLeader': 'NEUTRAL', 'delegates': ['NEUTRAL'], 'name': 'Mars First', 'description': 'All players receive 1 MC for each Building tag they have.'},
        {'delegates': [], 'name': 'Scientists', 'description': 'All players receive 1 MC for each Science tag they have.'},
        {'partyLeader': 'NEUTRAL', 'delegates': ['NEUTRAL'], 'name': 'Unity', 'description': 'All players receive 1 MC for each Venus tag, Earth tag, and Jovian tag they have.'},
        {'delegates': [], 'name': 'Greens', 'description': 'All players receive 1 MC for each Plant tag, Microbe tag, and Animal tag they have.'},
        {'delegates': [], 'name': 'Reds', 'description': 'The player with the lowest TR gains 1 TR. Ties are friendly.'},
        {'delegates': [], 'name': 'Kelvinists', 'description': 'All players receive 1 MC for each Heat production they have.'},
      ],
      'playersInfluenceBonus': [],
      'globalEventDealer': {
        'globalEventsDeck': [
          {'name': 'Scientific Community', 'description': 'Gain 1 MC for each card in hand (no limit) and influence.', 'revealedDelegate': 'Reds', 'currentDelegate': 'Scientists'},
          {'name': 'Sponsored Projects', 'description': 'All cards with resources on them gain 1 resource. Draw 1 card for each influence.', 'revealedDelegate': 'Scientists', 'currentDelegate': 'Greens'},
          {'name': 'Miners Of Strike', 'description': 'Lose 1 titanium for each Jovian tag (max 5, then reduced by influence).', 'revealedDelegate': 'Mars First', 'currentDelegate': 'Greens'},
          {'name': 'Snow Cover', 'description': 'Decrease temperature 2 steps. Draw 1 card per influence.', 'revealedDelegate': 'Kelvinists', 'currentDelegate': 'Kelvinists'},
          {'name': 'Mud Slides', 'description': 'Lose 4 MC for each tile adjacent to ocean (max 5, then reduced by influence).', 'revealedDelegate': 'Kelvinists', 'currentDelegate': 'Greens'},
          {'name': 'Pandemic', 'description': 'Lose 3 MC for each Building tag (max 5, then reduced by influence).', 'revealedDelegate': 'Greens', 'currentDelegate': 'Mars First'},
          {'name': 'Dry Deserts', 'description': 'First player removes 1 ocean tile from the gameboard. Gain 1 standard resource per influence.', 'revealedDelegate': 'Reds', 'currentDelegate': 'Unity'},
          {'name': 'War on Earth', 'description': 'Reduce TR 4 steps. Each influence prevents 1 step.', 'revealedDelegate': 'Mars First', 'currentDelegate': 'Kelvinists'},
          {'name': 'Eco Sabotage', 'description': 'Lose all plants except 3 + influence.', 'revealedDelegate': 'Greens', 'currentDelegate': 'Reds'},
          {'name': 'Election', 'description': 'Count your influence plus Building tags and City tiles (no limits). The player with most (or 10 in solo) gains 2 TR, the 2nd (or 5 in solo) gains 1 TR (ties are friendly).', 'revealedDelegate': 'Greens', 'currentDelegate': 'Mars First'},
          {'name': 'Revolution', 'description': 'Count Earth tags and ADD(!) influence. The player(s) with most (at least 1) loses 2 TR, and 2nd most (at least 1) loses 1 TR. SOLO: Lose 2 TR if the sum is 4 or more.', 'revealedDelegate': 'Unity', 'currentDelegate': 'Mars First'},
          {'name': 'Sabotage', 'description': 'Decrease steel and energy production 1 step each. Gain 1 steel per influence.', 'revealedDelegate': 'Unity', 'currentDelegate': 'Reds'},
          {'name': 'Global Dust Storm', 'description': 'Lose all heat. Lose 2 MC for each Building tag (max 5, then reduced by influence).', 'revealedDelegate': 'Kelvinists', 'currentDelegate': 'Greens'},
          {'name': 'Solarnet Shutdown', 'description': 'Lose 3 MC for each blue card (max 5, then reduced by influence).', 'revealedDelegate': 'Scientists', 'currentDelegate': 'Mars First'},
          {'name': 'Volcanic Eruptions', 'description': 'Increase temperature 2 steps. Increase heat production 1 step per influence.', 'revealedDelegate': 'Scientists', 'currentDelegate': 'Kelvinists'},
          {'name': 'Diversity', 'description': 'Gain 10 MC if you have 9 or more different tags. Influence counts as unique tags.', 'revealedDelegate': 'Scientists', 'currentDelegate': 'Scientists'},
          {'name': 'Venus Infrastructure', 'description': 'Gain 2 MC per Venus tag (max 5) and influence.', 'revealedDelegate': 'Mars First', 'currentDelegate': 'Unity'},
          {'name': 'Celebrity Leaders', 'description': 'Gain 2 MC for each event played (max 5) and influence.', 'revealedDelegate': 'Unity', 'currentDelegate': 'Greens'},
          {'name': 'Productivity', 'description': 'Gain 1 steel for each steel production (max 5) and influence.', 'revealedDelegate': 'Scientists', 'currentDelegate': 'Mars First'},
          {'name': 'Homeworld Support', 'description': 'Gain 2 MC for each Earth tag (max 5) and influence.', 'revealedDelegate': 'Reds', 'currentDelegate': 'Unity'},
          {'name': 'Strong Society', 'description': 'Gain 2 MC for each City tile (max 5) and influence.', 'revealedDelegate': 'Reds', 'currentDelegate': 'Mars First'},
          {'name': 'Asteroid Mining', 'description': 'Gain 1 titanium for each Jovian tag (max 5) and influence.', 'revealedDelegate': 'Reds', 'currentDelegate': 'Unity'},
          {'name': 'Riots', 'description': 'Lose 4 MC for each City tile (max 5, then reduced by influence).', 'revealedDelegate': 'Mars First', 'currentDelegate': 'Reds'},
          {'name': 'Spin-Off Products', 'description': 'Gain 2 MC for each Science tag (max 5) and influence.', 'revealedDelegate': 'Greens', 'currentDelegate': 'Scientists'},
          {'name': 'Paradigm Breakdown', 'description': 'Discard 2 cards from hand. Gain 2 MC per influence.', 'revealedDelegate': 'Kelvinists', 'currentDelegate': 'Reds'},
          {'name': 'Red Influence', 'description': 'Lose 3 MC for each set of 5 TR over 10 (max 5 sets). Increase MC production 1 step per influence.', 'revealedDelegate': 'Kelvinists', 'currentDelegate': 'Reds'},
          {'name': 'Generous Funding', 'description': 'Gain 2 MC for each influence and set of 5 TR over 15 (max 5 sets).', 'revealedDelegate': 'Kelvinists', 'currentDelegate': 'Unity'},
          {'name': 'Improved Energy Templates', 'description': 'Increase energy production 1 step per 2 power tags (no limit). Influence counts as power tags.', 'revealedDelegate': 'Scientists', 'currentDelegate': 'Kelvinists'},
          {'name': 'Successful Organisms', 'description': 'Gain 1 plant per plant production (max 5) and influence.', 'revealedDelegate': 'Mars First', 'currentDelegate': 'Scientists'},
        ],
        'discardedGlobalEvents': [
          {'name': 'Interplanetary Trade', 'description': 'Gain 2 MC for each space tag (max 5) and influence.', 'revealedDelegate': 'Unity', 'currentDelegate': 'Unity'},
        ],
      },
      'distantGlobalEvent': {'name': 'Aquifer Released by Public Council', 'description': 'First player places an ocean tile. Gain 1 plant and 1 steel per influence.', 'revealedDelegate': 'Mars First', 'currentDelegate': 'Greens'},
      'commingGlobalEvent': {'name': 'Solar Flare', 'description': 'Lose 3 MC for each space tag (max 5, then reduced by influence).', 'revealedDelegate': 'Unity', 'currentDelegate': 'Kelvinists'},
      'politicalAgendasData': {'thisAgenda': {'bonusId': 'none', 'policyId': 'none'}},
    };
    const s: SerializedTurmoil = JSON.parse(JSON.stringify(json));
    const t = Turmoil.deserialize(s);

    expect(t.distantGlobalEvent!.name).eq('Aquifer Released by Public Council');
    expect(t.comingGlobalEvent!.name).eq('Solar Flare');
    expect(t.delegateReserve).deep.eq(['blue-id', 'red-id', 'green-id', 'NEUTRAL', 'NEUTRAL']);
  });

  it('serializes and deserializes keeping players', function() {
    // Party delegates have to be explicitly set since game set-up draws a global event which
    // adds delegates to a party. So parties[0] can be empty or not depending on the draw.
    turmoil.parties[0].delegates = ['NEUTRAL', 'NEUTRAL', 'fancy-pants'];
    const serialized = JSON.parse(JSON.stringify(turmoil.serialize()));
    const deserialized = Turmoil.deserialize(serialized);
    expect(deserialized.parties[0].getPresentPlayers()).to.have.members(['NEUTRAL', 'fancy-pants']);
  });

  it('forward compatible deserialization', () => {
    const json = {
      'chairman': 'NEUTRAL',
      'rulingParty': 'Greens',
      'dominantParty': 'Unity',
      'lobby': ['blue-id'],
      'delegate_reserve': ['blue-id', 'red-id', 'green-id', 'NEUTRAL', 'NEUTRAL'],
      'parties': [
        {'name': 'Mars First', 'delegates': []},
        {'name': 'Scientists', 'delegates': []},
        {'name': 'Unity', 'delegates': ['NEUTRAL'], 'partyLeader': 'NEUTRAL'},
        {'name': 'Greens', 'delegates': ['NEUTRAL'], 'partyLeader': 'NEUTRAL'},
        {'name': 'Reds', 'delegates': []},
        {'name': 'Kelvinists', 'delegates': []},
      ],
      'playersInfluenceBonus': [],
      'globalEventDealer': {
        'deck': [
          'Solar Flare',
          'Spin-Off Products',
          'Dry Deserts',
          'Mud Slides',
          'Productivity'],
        'discarded': ['Pandemic']},
      'distantGlobalEvent': 'Eco Sabotage',
      'comingGlobalEvent': 'Celebrity Leaders',
      'politicalAgendasData': {'thisAgenda': {'bonusId': 'none', 'policyId': 'none'}},
    };
    const s: SerializedTurmoil = JSON.parse(JSON.stringify(json));
    const t = Turmoil.deserialize(s);

    expect(t.distantGlobalEvent!.name).eq('Eco Sabotage');
    expect(t.distantGlobalEvent!.revealedDelegate).eq('Greens');
    expect(t.comingGlobalEvent!.name).eq('Celebrity Leaders');
    expect(t.comingGlobalEvent!.revealedDelegate).eq('Unity');
    expect(t.delegateReserve).deep.eq(['blue-id', 'red-id', 'green-id', 'NEUTRAL', 'NEUTRAL']);
    expect(t.rulingParty!.description).eq('Want to see a new Earth as soon as possible.');
    expect(t.getPartyByName(PartyName.KELVINISTS)!.description).eq('Pushes for rapid terraforming, usually employing a heat-first strategy.');
  });

  function setRulingParty(turmoil: Turmoil, game: Game, party: IParty) {
    turmoil.rulingParty = party;
    PoliticalAgendas.setNextAgenda(turmoil, game);
  }
});
