import {expect} from 'chai';
import {CardRequirements} from '../../src/server/cards/CardRequirements';
import {runAllActions, cast, addGreenery, setTemperature, setOxygenLevel, setVenusScaleLevel, churnAction} from '../TestingUtils';
import {AdaptationTechnology} from '../../src/server/cards/base/AdaptationTechnology';
import {TileType} from '../../src/common/TileType';
import {Ants} from '../../src/server/cards/base/Ants';
import {Ceres} from '../../src/server/colonies/Ceres';
import {Celestic} from '../../src/server/cards/venusNext/Celestic';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {Tag} from '../../src/common/cards/Tag';
import {ResearchCoordination} from '../../src/server/cards/prelude/ResearchCoordination';
import {Resources} from '../../src/common/Resources';
import {SmallAsteroid} from '../../src/server/cards/promo/SmallAsteroid';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';

describe('CardRequirements', function() {
  let player: TestPlayer;
  let player2: TestPlayer;
  const adaptationTechnology = new AdaptationTechnology();

  beforeEach(function() {
    [, player, player2] = testGame(2, {turmoilExtension: true});
  });

  it('satisfies properly for oceans', function() {
    const requirements = CardRequirements.builder((b) => b.oceans(5));
    const oceanSpaces = player.game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 5; i++) {
      expect(requirements.satisfies(player)).eq(false);
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    for (let i = 0; i < 3; i++) {
      expect(requirements.satisfies(player)).eq(true);
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
  });

  it('satisfies properly for temperature max', function() {
    const requirements = CardRequirements.builder((b) => b.temperature(-10, {max: true}));
    expect(requirements.satisfies(player)).eq(true);
    setTemperature(player.game, -10);
    expect(requirements.satisfies(player)).eq(true);
    setTemperature(player.game, -8);
    expect(requirements.satisfies(player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for oxygen', function() {
    const requirements = CardRequirements.builder((b) => b.oxygen(4));
    expect(requirements.satisfies(player)).eq(false);
    setOxygenLevel(player.game, 4);
    expect(requirements.satisfies(player)).eq(true);
    setOxygenLevel(player.game, 3);
    expect(requirements.satisfies(player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for venus', function() {
    const requirements = CardRequirements.builder((b) => b.venus(8));
    expect(requirements.satisfies(player)).eq(false);
    setVenusScaleLevel(player.game, 8);
    expect(requirements.satisfies(player)).eq(true);
    setVenusScaleLevel(player.game, 7);
    expect(requirements.satisfies(player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for tr', function() {
    const requirements = CardRequirements.builder((b) => b.tr(25));
    expect(requirements.satisfies(player)).eq(false);
    player.setTerraformRating(25);
    expect(requirements.satisfies(player)).eq(true);
    player.setTerraformRating(24);
    expect(requirements.satisfies(player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(requirements.satisfies(player)).eq(false);
  });

  it('satisfies properly for chairman', function() {
    const requirements = CardRequirements.builder((b) => b.chairman());
    expect(requirements.satisfies(player)).eq(false);
    player.game.turmoil!.chairman = player.id;
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for resourceTypes', function() {
    const requirements = CardRequirements.builder((b) => b.resourceTypes(3, {max: true}));
    expect(requirements.satisfies(player)).eq(true);
    player.megaCredits = 10;
    player.steel = 2;
    player.titanium = 1;
    expect(requirements.satisfies(player)).eq(true);

    const ants = new Ants();
    player.playedCards.push(ants);
    ants.resourceCount = 2;
    expect(requirements.satisfies(player)).eq(false);
  });

  it('satisfies properly for greeneries', function() {
    const requirements = CardRequirements.builder((b) => b.greeneries(2, {max: true}));
    expect(requirements.satisfies(player)).eq(true);
    addGreenery(player);
    expect(requirements.satisfies(player)).eq(true);
    addGreenery(player);
    expect(requirements.satisfies(player)).eq(true);
    addGreenery(player2);
    expect(requirements.satisfies(player)).eq(true);
    addGreenery(player);
    expect(requirements.satisfies(player)).eq(false);
  });

  it('satisfies properly for cities', function() {
    const requirements = CardRequirements.builder((b) => b.cities(2, {all: true}));
    expect(requirements.satisfies(player)).eq(false);
    player.game.addCityTile(player2, player.game.board.getAvailableSpacesForCity(player)[0]);
    expect(requirements.satisfies(player)).eq(false);
    player.game.addCityTile(player, player.game.board.getAvailableSpacesForCity(player)[0]);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for colonies', function() {
    const requirements = CardRequirements.builder((b) => b.colonies(1));
    const colony = new Ceres();
    player.game.colonies.push(colony);
    expect(requirements.satisfies(player)).eq(false);
    colony.colonies.push(player2.id);
    expect(requirements.satisfies(player)).eq(false);
    colony.colonies.push(player.id);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for floaters', function() {
    const requirements = CardRequirements.builder((b) => b.floaters(2));
    const corp = new Celestic();
    player.setCorporationForTest(corp);
    churnAction(corp, player);
    expect(requirements.satisfies(player)).eq(false);
    churnAction(corp, player);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for partyLeaders', function() {
    const requirements = CardRequirements.builder((b) => b.partyLeaders(1));
    expect(requirements.satisfies(player)).eq(false);
    const greens = player.game.turmoil!.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player.id;
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for same tags', function() {
    const requirements = CardRequirements.builder((b) => b.tag(Tag.MICROBE, 2));

    const ants = new Ants();
    player.playedCards.push(ants);
    expect(requirements.satisfies(player)).eq(false);

    const researchCoordination = new ResearchCoordination();
    player.playedCards.push(researchCoordination);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for different tags', function() {
    const requirements = CardRequirements.builder((b) => b.tag(Tag.MICROBE).tag(Tag.ANIMAL));

    player.tagsForTest = {wild: 1};
    expect(requirements.satisfies(player)).eq(false);

    player.tagsForTest = {wild: 1, microbe: 1};
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for max tag requirement', function() {
    const requirements = CardRequirements.builder((b) => b.tag(Tag.MICROBE, 1, {max: true}));

    player.tagsForTest = {microbe: 1};
    expect(requirements.satisfies(player)).eq(true);

    player.tagsForTest = {microbe: 2};
    expect(requirements.satisfies(player)).eq(false);

    player.tagsForTest = {microbe: 1, wild: 1};
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for any tag requirement', function() {
    const requirements = CardRequirements.builder((b) => b.tag(Tag.MICROBE, 2, {all: true}));

    player.tagsForTest = {microbe: 2};
    expect(requirements.satisfies(player)).is.true;

    player.tagsForTest = {microbe: 1};
    expect(requirements.satisfies(player)).is.false;

    player.tagsForTest = {microbe: 1};
    player2.tagsForTest = {microbe: 1};
    expect(requirements.satisfies(player)).is.true;

    player.tagsForTest = {microbe: 0};
    player2.tagsForTest = {microbe: 2};
    expect(requirements.satisfies(player)).is.true;
  });

  it('satisfies properly for production', function() {
    const requirements = CardRequirements.builder((b) => b.production(Resources.PLANTS));
    expect(requirements.satisfies(player)).eq(false);
    player.production.add(Resources.PLANTS, 1);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for party', function() {
    const requirements = CardRequirements.builder((b) => b.party(PartyName.MARS));
    expect(requirements.satisfies(player)).eq(false);
    player.game.turmoil!.sendDelegateToParty(player.id, PartyName.MARS, player.game);
    player.game.turmoil!.sendDelegateToParty(player.id, PartyName.MARS, player.game);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for plantsRemoved', function() {
    const requirements = CardRequirements.builder((b) => b.plantsRemoved());
    expect(requirements.satisfies(player)).eq(false);

    player2.plants = 1;
    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player);
    // Choose Remove 1 plant option
    runAllActions(player.game);
    const orOptions = cast(player.getWaitingFor(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(requirements.satisfies(player)).eq(true);
  });

  it('throws errors when out of range', function() {
    expect(() => CardRequirements.builder((b) => b.temperature(-32))).to.throw();
    expect(() => CardRequirements.builder((b) => b.temperature(10))).to.throw();
    expect(() => CardRequirements.builder((b) => b.temperature(-5))).to.throw();
    expect(() => CardRequirements.builder((b) => b.oxygen(-1))).to.throw();
    expect(() => CardRequirements.builder((b) => b.oxygen(15))).to.throw();
    expect(() => CardRequirements.builder((b) => b.oceans(-1))).to.throw();
    expect(() => CardRequirements.builder((b) => b.oceans(10))).to.throw();
    expect(() => CardRequirements.builder((b) => b.venus(-1))).to.throw();
    expect(() => CardRequirements.builder((b) => b.venus(31))).to.throw();
  });
});
