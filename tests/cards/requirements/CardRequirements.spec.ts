import {expect} from 'chai';
import {CardRequirements} from '../../../src/server/cards/requirements/CardRequirements';
import {runAllActions, cast, addGreenery, setTemperature, setOxygenLevel, setVenusScaleLevel, churnAction} from '../../TestingUtils';
import {AdaptationTechnology} from '../../../src/server/cards/base/AdaptationTechnology';
import {TileType} from '../../../src/common/TileType';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Tag} from '../../../src/common/cards/Tag';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {Resource} from '../../../src/common/Resource';
import {SmallAsteroid} from '../../../src/server/cards/promo/SmallAsteroid';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {OneOrArray} from '../../../src/common/utils/types';
import {CardRequirementDescriptor} from '../../../src/common/cards/CardRequirementDescriptor';
import {IPlayer} from '../../../src/server/IPlayer';
import {asArray} from '../../../src/common/utils/utils';

function compile(req: OneOrArray<CardRequirementDescriptor>) {
  return CardRequirements.compile(asArray(req));
}
function satisfies(req: OneOrArray<CardRequirementDescriptor>, player: IPlayer) {
  return compile(asArray(req)).satisfies(player);
}

describe('CardRequirements', function() {
  let player: TestPlayer;
  let player2: TestPlayer;
  const adaptationTechnology = new AdaptationTechnology();

  beforeEach(function() {
    [/* game */, player, player2] = testGame(2, {turmoilExtension: true});
  });

  it('satisfies properly for oceans', function() {
    const requirements = {oceans: 5};
    const oceanSpaces = player.game.board.getAvailableSpacesForOcean(player);
    for (let i = 0; i < 5; i++) {
      expect(satisfies(requirements, player)).eq(false);
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
    for (let i = 0; i < 3; i++) {
      expect(satisfies(requirements, player)).eq(true);
      oceanSpaces[i].tile = {tileType: TileType.OCEAN};
    }
  });

  it('satisfies properly for temperature max', function() {
    const requirements = {temperature: -10, max: true};
    expect(satisfies(requirements, player)).eq(true);
    setTemperature(player.game, -10);
    expect(satisfies(requirements, player)).eq(true);
    setTemperature(player.game, -8);
    expect(satisfies(requirements, player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for oxygen', function() {
    const requirements = {oxygen: 4};
    expect(satisfies(requirements, player)).eq(false);
    setOxygenLevel(player.game, 4);
    expect(satisfies(requirements, player)).eq(true);
    setOxygenLevel(player.game, 3);
    expect(satisfies(requirements, player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for venus', function() {
    const requirements = {venus: 8};
    expect(satisfies(requirements, player)).eq(false);
    setVenusScaleLevel(player.game, 8);
    expect(satisfies(requirements, player)).eq(true);
    setVenusScaleLevel(player.game, 7);
    expect(satisfies(requirements, player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for tr', function() {
    const requirements = {tr: 25};
    expect(satisfies(requirements, player)).eq(false);
    player.setTerraformRating(25);
    expect(satisfies(requirements, player)).eq(true);
    player.setTerraformRating(24);
    expect(satisfies(requirements, player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(satisfies(requirements, player)).eq(false);
  });

  it('satisfies properly for chairman', function() {
    const requirements = {chairman: true};
    expect(satisfies(requirements, player)).eq(false);
    player.game.turmoil!.chairman = player;
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for resourceTypes', function() {
    const requirements = {resourceTypes: 3, max: true};
    expect(satisfies(requirements, player)).eq(true);
    player.megaCredits = 10;
    player.steel = 2;
    player.titanium = 1;
    expect(satisfies(requirements, player)).eq(true);

    const ants = new Ants();
    player.playedCards.push(ants);
    ants.resourceCount = 2;
    expect(satisfies(requirements, player)).eq(false);
  });

  it('satisfies properly for greeneries', function() {
    const requirements = {greeneries: 2, max: true};
    expect(satisfies(requirements, player)).eq(true);
    addGreenery(player);
    expect(satisfies(requirements, player)).eq(true);
    addGreenery(player);
    expect(satisfies(requirements, player)).eq(true);
    addGreenery(player2);
    expect(satisfies(requirements, player)).eq(true);
    addGreenery(player);
    expect(satisfies(requirements, player)).eq(false);
  });

  it('satisfies properly for cities', function() {
    const requirements = {cities: 2, all: true};
    expect(satisfies(requirements, player)).eq(false);
    player.game.addCity(player2, player.game.board.getAvailableSpacesForCity(player)[0]);
    expect(satisfies(requirements, player)).eq(false);
    player.game.addCity(player, player.game.board.getAvailableSpacesForCity(player)[0]);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for colonies', function() {
    const requirements = {colonies: 1};
    const colony = new Ceres();
    player.game.colonies.push(colony);
    expect(satisfies(requirements, player)).eq(false);
    colony.colonies.push(player2.id);
    expect(satisfies(requirements, player)).eq(false);
    colony.colonies.push(player.id);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for floaters', function() {
    const requirements = {floaters: 2};
    const corp = new Celestic();
    player.corporations.push(corp);
    churnAction(corp, player);
    expect(satisfies(requirements, player)).eq(false);
    churnAction(corp, player);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for partyLeaders', function() {
    const requirements = {partyLeader: 1};
    expect(satisfies(requirements, player)).eq(false);
    const greens = player.game.turmoil!.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player;
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for same tags', function() {
    const requirements = {tag: Tag.MICROBE, count: 2};

    const ants = new Ants();
    player.playedCards.push(ants);
    expect(satisfies(requirements, player)).eq(false);

    const researchCoordination = new ResearchCoordination();
    player.playedCards.push(researchCoordination);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for different tags', function() {
    const requirements = [{tag: Tag.MICROBE}, {tag: Tag.ANIMAL}];

    player.tagsForTest = {wild: 1};
    expect(satisfies(requirements, player)).eq(false);

    player.tagsForTest = {wild: 1, microbe: 1};
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for max tag requirement', function() {
    const requirements = {tag: Tag.MICROBE, max: true};

    player.tagsForTest = {microbe: 1};
    expect(satisfies(requirements, player)).eq(true);

    player.tagsForTest = {microbe: 2};
    expect(satisfies(requirements, player)).eq(false);

    player.tagsForTest = {microbe: 1, wild: 1};
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for any tag requirement', function() {
    const requirements = {tag: Tag.MICROBE, count: 2, all: true};

    player.tagsForTest = {microbe: 2};
    expect(satisfies(requirements, player)).is.true;

    player.tagsForTest = {microbe: 1};
    expect(satisfies(requirements, player)).is.false;

    player.tagsForTest = {microbe: 1};
    player2.tagsForTest = {microbe: 1};
    expect(satisfies(requirements, player)).is.true;

    player.tagsForTest = {microbe: 0};
    player2.tagsForTest = {microbe: 2};
    expect(satisfies(requirements, player)).is.true;
  });

  it('satisfies properly for production', function() {
    const requirements = {production: Resource.PLANTS};
    expect(satisfies(requirements, player)).eq(false);
    player.production.add(Resource.PLANTS, 1);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for party', function() {
    const requirements = {party: PartyName.MARS};
    expect(satisfies(requirements, player)).eq(false);
    player.game.turmoil!.sendDelegateToParty(player, PartyName.MARS, player.game);
    player.game.turmoil!.sendDelegateToParty(player, PartyName.MARS, player.game);
    expect(satisfies(requirements, player)).eq(true);
  });

  it('satisfies properly for plantsRemoved', function() {
    const requirements = {plantsRemoved: true};
    expect(satisfies(requirements, player)).eq(false);

    player2.plants = 1;
    const smallAsteroid = new SmallAsteroid();
    smallAsteroid.play(player);
    // Choose Remove 1 plant option
    runAllActions(player.game);
    const orOptions = cast(player.getWaitingFor(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(satisfies(requirements, player)).eq(true);
  });

  it('throws errors when out of range', function() {
    expect(() => compile({temperature: -32})).to.throw();
    expect(() => compile({temperature: 10})).to.throw();
    expect(() => compile({temperature: -5})).to.throw();
    expect(() => compile({oxygen: -1})).to.throw();
    expect(() => compile({oxygen: 15})).to.throw();
    expect(() => compile({oceans: -1})).to.throw();
    expect(() => compile({oceans: 10})).to.throw();
    expect(() => compile({venus: -1})).to.throw();
    expect(() => compile({venus: 31})).to.throw();
  });
});
