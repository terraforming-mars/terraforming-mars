import {expect} from 'chai';
import {CardRequirements} from '../../src/cards/CardRequirements';
import {Player} from '../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../TestingUtils';
import {Game} from '../../src/Game';
import {AdaptationTechnology} from '../../src/cards/base/AdaptationTechnology';
import {TileType} from '../../src/TileType';
import {Ants} from '../../src/cards/base/Ants';
import {AresTestHelper} from '../ares/AresTestHelper';
import {Ceres} from '../../src/colonies/Ceres';
import {Celestic} from '../../src/cards/venusNext/Celestic';
import {PartyName} from '../../src/turmoil/parties/PartyName';
import {Tags} from '../../src/cards/Tags';
import {ResearchCoordination} from '../../src/cards/prelude/ResearchCoordination';
import {Resources} from '../../src/Resources';
import {SmallAsteroid} from '../../src/cards/promo/SmallAsteroid';
import {OrOptions} from '../../src/inputs/OrOptions';

describe('CardRequirements', function() {
  let player: Player; let player2: Player;
  const adaptationTechnology = new AdaptationTechnology();

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();

    Game.newInstance('foobar', [player, player2], player, gameOptions);
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
    const requirements = CardRequirements.builder((b) => b.temperature(-10).max());
    expect(requirements.satisfies(player)).eq(true);
    (player.game as any).temperature = -10;
    expect(requirements.satisfies(player)).eq(true);
    (player.game as any).temperature = -8;
    expect(requirements.satisfies(player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for oxygen', function() {
    const requirements = CardRequirements.builder((b) => b.oxygen(4));
    expect(requirements.satisfies(player)).eq(false);
    (player.game as any).oxygenLevel = 4;
    expect(requirements.satisfies(player)).eq(true);
    (player.game as any).oxygenLevel = 3;
    expect(requirements.satisfies(player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for venus', function() {
    const requirements = CardRequirements.builder((b) => b.venus(8));
    expect(requirements.satisfies(player)).eq(false);
    (player.game as any).venusScaleLevel = 8;
    expect(requirements.satisfies(player)).eq(true);
    (player.game as any).venusScaleLevel = 7;
    expect(requirements.satisfies(player)).eq(false);
    player.playCard(adaptationTechnology);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for tr', function() {
    const requirements = CardRequirements.builder((b) => b.tr(25));
    expect(requirements.satisfies(player)).eq(false);
    (player as any).terraformRating = 25;
    expect(requirements.satisfies(player)).eq(true);
    (player as any).terraformRating = 24;
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
    const requirements = CardRequirements.builder((b) => b.resourceTypes(3).max());
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
    const requirements = CardRequirements.builder((b) => b.greeneries(2).max());
    expect(requirements.satisfies(player)).eq(true);
    AresTestHelper.addGreenery(player.game, player);
    expect(requirements.satisfies(player)).eq(true);
    AresTestHelper.addGreenery(player.game, player);
    expect(requirements.satisfies(player)).eq(true);
    AresTestHelper.addGreenery(player.game, player2);
    expect(requirements.satisfies(player)).eq(true);
    AresTestHelper.addGreenery(player.game, player);
    expect(requirements.satisfies(player)).eq(false);
  });

  it('satisfies properly for cities', function() {
    const requirements = CardRequirements.builder((b) => b.cities(2).any());
    expect(requirements.satisfies(player)).eq(false);
    player.game.addCityTile(player2, player.game.board.getAvailableSpacesForCity(player)[0].id);
    expect(requirements.satisfies(player)).eq(false);
    player.game.addCityTile(player, player.game.board.getAvailableSpacesForCity(player)[0].id);
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
    player.corporationCard = corp;
    corp.action(player);
    expect(requirements.satisfies(player)).eq(false);
    corp.action(player);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for partyLeaders', function() {
    const requirements = CardRequirements.builder((b) => b.partyLeaders(1));
    expect(requirements.satisfies(player)).eq(false);
    const greens = player.game.turmoil!.getPartyByName(PartyName.GREENS)!;
    greens.partyLeader = player.id;
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for same tags', function() {
    const requirements = CardRequirements.builder((b) => b.tag(Tags.MICROBE, 2));

    const ants = new Ants();
    player.playedCards.push(ants);
    expect(requirements.satisfies(player)).eq(false);

    const researchCoordination = new ResearchCoordination();
    player.playedCards.push(researchCoordination);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for different tags', function() {
    const requirements = CardRequirements.builder((b) => b.tag(Tags.MICROBE).tag(Tags.ANIMAL));

    const researchCoordination = new ResearchCoordination();
    player.playedCards.push(researchCoordination);
    expect(requirements.satisfies(player)).eq(false);

    const ants = new Ants();
    player.playedCards.push(ants);
    expect(requirements.satisfies(player)).eq(true);
  });

  it('satisfies properly for production', function() {
    const requirements = CardRequirements.builder((b) => b.production(Resources.PLANTS));
    expect(requirements.satisfies(player)).eq(false);
    player.addProduction(Resources.PLANTS);
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
    smallAsteroid.play(player, player.game);
    // Choose Remove 1 plant option
    const orOptions = player.game.deferredActions.next()!.execute() as OrOptions;
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
