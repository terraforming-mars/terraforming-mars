import {expect} from 'chai';
import {ISpace} from '../../src/boards/ISpace';
import {SpecialDesign} from '../../src/cards/base/SpecialDesign';
import {EcologicalSurvey} from '../../src/cards/ares/EcologicalSurvey';
import {GeologicalSurvey} from '../../src/cards/ares/GeologicalSurvey';
import {LunaMiningHub} from '../../src/cards/moon/LunaMiningHub';
import {Philares} from '../../src/cards/promo/Philares';
import {Game} from '../../src/Game';
import {IMoonData} from '../../src/moon/IMoonData';
import {MoonExpansion} from '../../src/moon/MoonExpansion';
import {MoonSpaces} from '../../src/moon/MoonSpaces';
import {Resources} from '../../src/Resources';
import {SpaceName} from '../../src/SpaceName';
import {TileType} from '../../src/TileType';
import {TestingUtils} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {TestPlayers} from '../TestPlayers';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MoonExpansion', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.PINK.newPlayer();
    game = Game.newInstance('id', [player, player2], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
  });

  it('addTile', () => {
    MoonExpansion.addTile(player, MoonSpaces.MARE_IMBRIUM, {tileType: TileType.LUNA_TRADE_STATION});
    const space: ISpace = moonData.moon.getSpace(MoonSpaces.MARE_IMBRIUM);
    expect(space.player).eq(player);
    expect(space.tile).deep.eq({tileType: TileType.LUNA_TRADE_STATION});
  });

  it('addTile grants space bonus', () => {
    // Contains card and steel.
    player.steel = 0;
    player.cardsInHand = [];
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_ROAD});
    expect(player.steel).eq(1);
    expect(player.cardsInHand).has.length(1);
  });

  it('addTile fails occupied space', () => {
    const space: ISpace = moonData.moon.getSpace(MoonSpaces.MARE_IMBRIUM);
    space.tile = {tileType: TileType.MOON_MINE};
    expect(() => MoonExpansion.addTile(player, MoonSpaces.MARE_IMBRIUM, {tileType: TileType.LUNA_TRADE_STATION})).to.throw(/occupied/);
  });

  it('addTile throws with Mars space', () => {
    expect(() => MoonExpansion.addTile(player, SpaceName.NOCTIS_CITY, {tileType: TileType.LUNA_TRADE_STATION})).to.throw(/.*/);
  });

  // The rules for how these cards could change, and that's fine if that means
  // changing these tests, but I would be surprised if that were the case.
  it('Adding a tile while someone has cards with onTilePlaced behavior does not trigger them.', () => {
    player.cardsInHand = [new EcologicalSurvey(), new GeologicalSurvey()];
    player.corporationCard = new Philares();
    player.steel = 0;
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_ROAD});
    expect(player.steel).eq(1);
  });

  it('raiseMiningRate', () => {
    expect(moonData.miningRate).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
    MoonExpansion.raiseMiningRate(player);
    expect(moonData.miningRate).to.eq(1);
    expect(player.getTerraformRating()).eq(21);
  });

  it('computeVictoryPoints', () => {
    const vps = player.victoryPointsBreakdown;
    function computeVps() {
      vps.moonColonies = 0;
      vps.moonMines = 0;
      vps.moonRoads = 0;
      MoonExpansion.calculateVictoryPoints(player, vps);
      return {
        colonies: vps.moonColonies,
        mines: vps.moonMines,
        roads: vps.moonRoads,
      };
    };

    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 0});
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_ROAD});
    MoonExpansion.calculateVictoryPoints(player, vps);
    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 1});
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_COLONY});

    // Reassign that road to the other player, and our player still gets credit for the colony;
    moonData.moon.getSpace('m02').player = player2;
    expect(computeVps()).eql({colonies: 1, mines: 0, roads: 0});

    // Put a mine in the adjacent space, and the score appropriately follows
    moonData.moon.getSpace('m03').tile = {tileType: TileType.MOON_MINE};
    expect(computeVps()).eql({colonies: 0, mines: 1, roads: 0});

    // Remove the road, and the mine is worth nothing.
    moonData.moon.getSpace('m03').tile = undefined;
    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 0});
  });

  it('Raise mining rate bonus 2-3', () => {
    moonData.miningRate = 2;
    player.cardsInHand = [];
    MoonExpansion.raiseMiningRate(player, 1);
    expect(player.cardsInHand).has.length(1);
  });

  it('Raise mining rate bonus 1-4', () => {
    moonData.miningRate = 1;
    player.cardsInHand = [];
    MoonExpansion.raiseMiningRate(player, 3);
    expect(player.cardsInHand).has.length(1);
  });

  it('Raise mining rate bonus 5-6', () => {
    moonData.miningRate = 5;
    player.setProductionForTest({titanium: 0});
    MoonExpansion.raiseMiningRate(player, 1);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
  });

  it('Raise logistic rate bonus 2-3', () => {
    moonData.logisticRate = 2;
    player.cardsInHand = [];
    MoonExpansion.raiseLogisticRate(player, 1);
    expect(player.cardsInHand).has.length(1);
  });

  it('Raise logistic rate bonus 5-6', () => {
    moonData.logisticRate = 5;
    player.setProductionForTest({steel: 0});
    MoonExpansion.raiseLogisticRate(player, 1);
    expect(player.getProduction(Resources.STEEL)).eq(1);
  });

  it('Raise colony rate bonus 2-3', () => {
    moonData.colonyRate = 2;
    player.cardsInHand = [];
    MoonExpansion.raiseColonyRate(player, 1);
    expect(player.cardsInHand).has.length(1);
  });

  it('Raise colony rate bonus 5-6', () => {
    moonData.colonyRate = 5;
    player.cardsInHand = [];
    MoonExpansion.raiseColonyRate(player, 1);
    expect(player.cardsInHand).has.length(1);
  });

  it('Moon parameters are global parameters', () => {
    const card = new LunaMiningHub(); // requires mining rate 5.
    const specialDesign = new SpecialDesign();

    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    player.steel = 1;
    moonData.miningRate = 3;
    expect(player.getPlayableCards()).does.not.include(card);

    // Gives a +2/-2 on the next action
    player.playedCards = [specialDesign];
    player.lastCardPlayed = specialDesign;

    expect(player.getPlayableCards()).does.include(card);
  });
});
