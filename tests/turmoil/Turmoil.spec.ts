import {expect} from 'chai';
import {Player} from '../../src/Player';
import {PartyName} from '../../src/turmoil/parties/PartyName';
import {Game} from '../../src/Game';
import {MarsFirst} from '../../src/turmoil/parties/MarsFirst';
import {Phase} from '../../src/Phase';
import {OrOptions} from '../../src/inputs/OrOptions';
import {SelectSpace} from '../../src/inputs/SelectSpace';
import {SpaceBonus} from '../../src/SpaceBonus';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestingUtils} from '../TestingUtils';
import {TestPlayers} from '../TestPlayers';
import {TestPlayer} from '../TestPlayer';
import {Reds} from '../../src/turmoil/parties/Reds';
import {Greens} from '../../src/turmoil/parties/Greens';
import {ReleaseOfInertGases} from '../../src/cards/base/ReleaseOfInertGases';
import {JovianEmbassy} from '../../src/cards/promo/JovianEmbassy';
import {IceAsteroid} from '../../src/cards/base/IceAsteroid';
import {ProtectedValley} from '../../src/cards/base/ProtectedValley';
import {MagneticFieldGeneratorsPromo} from '../../src/cards/promo/MagneticFieldGeneratorsPromo';
import {Resources} from '../../src/Resources';
import {NitrogenFromTitan} from '../../src/cards/colonies/NitrogenFromTitan';
import {SpaceStation} from '../../src/cards/base/SpaceStation';
import {EarthCatapult} from '../../src/cards/base/EarthCatapult';
import {QuantumExtractor} from '../../src/cards/base/QuantumExtractor';
import * as constants from '../../src/constants';
import {SerializedTurmoil} from '../../src/turmoil/SerializedTurmoil';
import {PoliticalAgendas} from '../../src/turmoil/PoliticalAgendas';
import {IParty} from '../../src/turmoil/parties/IParty';
import {GreeneryStandardProject} from '../../src/cards/base/standardProjects/GreeneryStandardProject';
import {ArtificialLake} from '../../src/cards/base/ArtificialLake';
import {LavaFlows} from '../../src/cards/base/LavaFlows';
import {StripMine} from '../../src/cards/base/StripMine';
import {GiantSolarShade} from '../../src/cards/venusNext/GiantSolarShade';
import {WaterTreatmentComplex} from '../../src/cards/moon/WaterTreatmentComplex';
import {DarksideMeteorBombardment} from '../../src/cards/moon/DarksideMeteorBombardment';
import {LunaStagingStation} from '../../src/cards/moon/LunaStagingStation';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {TileType} from '../../src/TileType';

describe('Turmoil', function() {
  let player : TestPlayer; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();

    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    game.phase = Phase.ACTION;
    turmoil = game.turmoil!;
    TestingUtils.resetBoard(game);
  });

  it('Should initialize with right defaults', function() {
    expect(turmoil.chairman).to.eq('NEUTRAL');
    expect(turmoil.rulingParty.name).to.eq(PartyName.GREENS);
  });

  it('Correctly send delegate from the lobby', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.delegates = [];

    expect(turmoil.lobby).contains(player.id);

    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);

    expect(greens.delegates).has.lengthOf(1);
    expect(game.getPlayerById(greens.delegates[0])).to.eq(player);
    expect(turmoil.lobby).does.not.contain(player.id);
  });

  it('Correctly send delegate from the reserve', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.delegates = [];
    expect(turmoil.lobby).contains(player.id);

    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game, 'reserve');

    expect(greens.delegates).has.lengthOf(1);
    expect(game.getPlayerById(greens.delegates[0])).to.eq(player);
    expect(turmoil.lobby).contains(player.id);
  });


  it('Do not send delegate from reserve when reserve is empty', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.delegates = [];
    turmoil.delegateReserve = [];

    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game, 'reserve');
    expect(greens.delegates).has.lengthOf(0);
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
    game.deferredActions.runAll(() => {});

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

    expect(player.canPlay(releaseOfInertGases)).is.not.true; // needs 20 MC
    expect(player.canPlay(jovianEmbassy)).is.not.true; // needs 17 MC

    player.addProduction(Resources.ENERGY, 4);
    player.megaCredits = 30;
    const magneticFieldGeneratorsPromo = new MagneticFieldGeneratorsPromo();
    expect(player.canPlay(magneticFieldGeneratorsPromo)).is.not.true; // needs 31 MC
  });

  it('Can\'t play cards to raise TR via global parameters if Reds are ruling and player cannot pay', function() {
    setRulingParty(turmoil, game, new Reds());
    // Both of these cards cost 23MC.
    const iceAsteroid = new IceAsteroid();
    const protectedValley = new ProtectedValley();
    player.megaCredits = 25;

    expect(player.canPlay(iceAsteroid)).is.not.true; // needs 29 MC
    expect(player.canPlay(protectedValley)).is.not.true; // needs 26 MC

    // can play if won't gain TR from raising global parameter
    TestingUtils.maxOutOceans(player, 9);
    expect(player.canPlay(protectedValley)).is.true;
    expect(player.canPlay(iceAsteroid)).is.true;
  });

  it('Applies card discounts when checking canPlay while Reds are ruling', function() {
    setRulingParty(turmoil, game, new Reds());
    const nitrogenFromTitan = new NitrogenFromTitan();

    player.megaCredits = 29;
    expect(player.canPlay(nitrogenFromTitan)).is.not.true; // needs 31 MC

    player.playedCards.push(new SpaceStation());
    expect(player.canPlay(nitrogenFromTitan)).is.true; // 25 + 6 - 2

    player.playedCards.push(new EarthCatapult(), new QuantumExtractor());
    player.megaCredits = 25;
    expect(player.canPlay(nitrogenFromTitan)).is.true; // 25 + 6 - 6
  });


  it('canPlay: reds tax applies by default when raising oxygen', function() {
  // Strip Mine raises the oxygen level two steps.
    const card = new StripMine();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;
    player.setProductionForTest({energy: 2}); // Card requirement.

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).is.true;

    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL - 1;
    player.megaCredits = card.cost + 2;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: when paying reds tax for oxygen, include the cost for the 8% temperature bump.', function() {
  // Strip Mine raises the oxygen level two steps.
    const card = new StripMine();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;
    player.setProductionForTest({energy: 2}); // Card requirement.

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    // Raising to 8%
    (game as any).oxygenLevel = 7;

    player.megaCredits = card.cost + 8;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 9;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: when paying reds tax for oxygen, include the cost for the 8% temperature bump, which triggers 0° ocean bump.', function() {
    // Strip Mine raises the oxygen level two steps.
    const card = new StripMine();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;
    player.setProductionForTest({energy: 2}); // Card requirement.

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    // Raising to 8%
    (game as any).oxygenLevel = 7;
    // Raising to 0
    (game as any).temperature = -2;

    player.megaCredits = card.cost + 11;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 12;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: reds tax applies by default when raising temperature', function() {
    // LavaFlows raises the temperature two steps.
    const card = new LavaFlows();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).is.true;

    // Set temperature so it only raises one step.
    (game as any).temperature = constants.MAX_TEMPERATURE - 2;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    (game as any).temperature = constants.MAX_TEMPERATURE;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: when paying reds tax for temperature, include the cost for the 0° ocean bump.', function() {
    // LavaFlows raises the temperature two steps.
    const card = new LavaFlows();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    // Raising to 0
    (game as any).temperature = -2;

    player.megaCredits = card.cost + 8;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 9;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: reds tax applies by default when placing oceans', function() {
    // ArtificialLake uses trSource.
    const card = new ArtificialLake();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    (game as any).temperature = -6; // minimum requirement for the card.
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    TestingUtils.maxOutOceans(player);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });

  // TODO(kberg): Use Towing a Comet as an example of a multi-TR thing.

  it('canPlay: reds tax applies by default when raising the venus scale.', function() {
    // GiantSolarShade raises venus three steps.
    const card = new GiantSolarShade();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + 8;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 9;
    expect(player.canPlay(card)).is.true;

    // Set Venus so it only raises one step.
    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE - 2;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: when paying reds tax for venus, include the cost for the 16% TR', function() {
    // GiantSolarShade raises venus three steps.
    const card = new GiantSolarShade();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    // Raising to or above 16%
    (game as any).venusScaleLevel = 14;

    player.megaCredits = card.cost + 11;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 12;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: reds tax applies by default when raising moon colony rate', function() {
    // Raises the colony rate two steps.
    const card = new WaterTreatmentComplex();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({moonExpansion: true}));
    const turmoil = game.turmoil!;
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements.
    moonData.moon.getAvailableSpacesOnLand(player)[0].tile = {tileType: TileType.MOON_COLONY};
    player.titanium = 1;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).is.true;

    moonData.colonyRate = 7;
    player.megaCredits = card.cost + 2;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    moonData.colonyRate = 8;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: reds tax applies by default when raising moon mining rate', function() {
    // Raises the mining rate two steps.
    const card = new DarksideMeteorBombardment();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({moonExpansion: true}));
    const turmoil = game.turmoil!;
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).is.true;

    moonData.miningRate = 7;
    player.megaCredits = card.cost + 2;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    moonData.miningRate = 8;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay: reds tax applies by default when raising moon logistic rate', function() {
    // Raises the logistic rate two steps.
    const card = new LunaStagingStation();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({moonExpansion: true}));
    const turmoil = game.turmoil!;
    const moonData = MoonExpansion.moonData(game);
    game.phase = Phase.ACTION;

    // Card requirements
    moonData.logisticRate = 2;
    player.titanium = 1;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;

    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).is.true;

    moonData.logisticRate = 7;
    player.megaCredits = card.cost + 2;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 3;
    expect(player.canPlay(card)).is.true;

    moonData.logisticRate = 8;

    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
  });

  it('serializes and deserializes keeping players', function() {
    // Party delegates have to be explicitly set since game set-up draws a global event which
    // adds delegates to a party. So parties[0] can be empty or not depending on the draw.
    turmoil.parties[0].delegates = ['NEUTRAL', 'NEUTRAL', 'fancy-pants'];
    const serialized = JSON.parse(JSON.stringify(turmoil.serialize()));
    const deserialized = Turmoil.deserialize(serialized);
    expect(deserialized.parties[0].getPresentPlayers()).to.have.members(['NEUTRAL', 'fancy-pants']);
  });

  it('deserialization', () => {
    const json = {
      'chairman': 'NEUTRAL',
      'rulingParty': 'Greens',
      'dominantParty': 'Unity',
      'lobby': ['blue-id'],
      'delegateReserve': ['blue-id', 'red-id', 'green-id', 'NEUTRAL', 'NEUTRAL'],
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
