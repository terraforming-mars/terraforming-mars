import {expect} from 'chai';
import {ISpace} from '../../src/server/boards/ISpace';
import {SpecialDesign} from '../../src/server/cards/base/SpecialDesign';
import {EcologicalSurvey} from '../../src/server/cards/ares/EcologicalSurvey';
import {GeologicalSurvey} from '../../src/server/cards/ares/GeologicalSurvey';
import {LunaMiningHub} from '../../src/server/cards/moon/LunaMiningHub';
import {Philares} from '../../src/server/cards/promo/Philares';
import {Game} from '../../src/server/Game';
import {IMoonData} from '../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../src/server/moon/MoonExpansion';
import {MoonSpaces} from '../../src/common/moon/MoonSpaces';
import {SpaceName} from '../../src/server/SpaceName';
import {TileType} from '../../src/common/TileType';
import {testGameOptions} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {Phase} from '../../src/common/Phase';
import {VictoryPointsBreakdown} from '../../src/server/VictoryPointsBreakdown';

describe('MoonExpansion', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.PINK.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({moonExpansion: true}));
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
    player.setCorporationForTest(new Philares());
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

  it('raiseColonyRate', () => {
    expect(moonData.colonyRate).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
    MoonExpansion.raiseHabitatRate(player);
    expect(moonData.colonyRate).to.eq(1);
    expect(player.getTerraformRating()).eq(21);
  });

  it('raiseLogisticsRate', () => {
    expect(moonData.logisticRate).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
    MoonExpansion.raiseLogisticRate(player);
    expect(moonData.logisticRate).to.eq(1);
    expect(player.getTerraformRating()).eq(21);
  });

  it('computeVictoryPoints', () => {
    const vps = new VictoryPointsBreakdown();
    function computeVps() {
      vps.points.moonHabitats = 0;
      vps.points.moonMines = 0;
      vps.points.moonRoads = 0;
      MoonExpansion.calculateVictoryPoints(player, vps);
      return {
        colonies: vps.points.moonHabitats,
        mines: vps.points.moonMines,
        roads: vps.points.moonRoads,
      };
    }

    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 0});
    MoonExpansion.addTile(player, 'm02', {tileType: TileType.MOON_ROAD});
    MoonExpansion.calculateVictoryPoints(player, vps);
    expect(computeVps()).eql({colonies: 0, mines: 0, roads: 1});
    MoonExpansion.addTile(player, 'm03', {tileType: TileType.MOON_HABITAT});

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
    player.production.override({titanium: 0});
    MoonExpansion.raiseMiningRate(player, 1);
    expect(player.production.titanium).eq(1);
  });

  it('Raise logistic rate bonus 2-3', () => {
    moonData.logisticRate = 2;
    player.cardsInHand = [];
    MoonExpansion.raiseLogisticRate(player, 1);
    expect(player.cardsInHand).has.length(1);
  });

  it('Raise logistic rate bonus 5-6', () => {
    moonData.logisticRate = 5;
    player.production.override({steel: 0});
    MoonExpansion.raiseLogisticRate(player, 1);
    expect(player.production.steel).eq(1);
  });

  it('Raise habitat rate bonus 2-3', () => {
    moonData.colonyRate = 2;
    player.cardsInHand = [];
    MoonExpansion.raiseHabitatRate(player, 1);
    expect(player.cardsInHand).has.length(1);
  });

  it('Raise habitat rate bonus 5-6', () => {
    moonData.colonyRate = 5;
    player.production.override({energy: 0});
    MoonExpansion.raiseHabitatRate(player, 1);
    expect(player.production.energy).eq(1);
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
    player.lastCardPlayed = specialDesign.name;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('raiseMiningRate during WGT', () => {
    game.phase = Phase.SOLAR;
    expect(moonData.miningRate).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
    MoonExpansion.raiseMiningRate(player);
    expect(moonData.miningRate).to.eq(1);
    expect(player.getTerraformRating()).eq(20);
  });

  it('raiseColonyRate during WGT', () => {
    game.phase = Phase.SOLAR;
    expect(moonData.colonyRate).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
    MoonExpansion.raiseHabitatRate(player);
    expect(moonData.colonyRate).to.eq(1);
    expect(player.getTerraformRating()).eq(20);
  });

  it('raiseLogisticsRate during WGT', () => {
    game.phase = Phase.SOLAR;
    expect(moonData.logisticRate).to.eq(0);
    expect(player.getTerraformRating()).eq(20);
    MoonExpansion.raiseLogisticRate(player);
    expect(moonData.logisticRate).to.eq(1);
    expect(player.getTerraformRating()).eq(20);
  });
});
