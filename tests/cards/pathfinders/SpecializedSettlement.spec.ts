import {expect} from 'chai';
import {SpecializedSettlement} from '../../../src/cards/pathfinders/SpecializedSettlement';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestingUtils} from '../../TestingUtils';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {Units} from '../../../src/common/Units';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {RoboticWorkforce} from '../../../src/cards/base/RoboticWorkforce';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SpecializedSettlement', function() {
  let card: SpecializedSettlement;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SpecializedSettlement();
    game = newTestGame(1, {aresExtension: true, pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
    game.board = EmptyBoard.newInstance();
    player.popWaitingFor(); // Clears out the default waiting for (selecting initial cards)
  });

  it('Can play', () => {
    player.setProductionForTest({energy: 0});
    expect(player.canPlayIgnoringCost(card)).is.false;
    player.setProductionForTest({energy: 1});
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', function() {
    singleResourceTest(
      SpaceBonus.DRAW_CARD,
      {},
      {energy: 0, megacredits: 3});
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play - steel', function() {
    singleResourceTest(
      SpaceBonus.STEEL,
      {steel: 1},
      {energy: 0, megacredits: 3, steel: 1});
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play - titanium', function() {
    singleResourceTest(
      SpaceBonus.TITANIUM,
      {titanium: 1},
      {energy: 0, megacredits: 3, titanium: 1});
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play - plants', function() {
    singleResourceTest(
      SpaceBonus.PLANT,
      {plants: 1},
      {energy: 0, megacredits: 3, plants: 1});
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play - heat', function() {
    singleResourceTest(
      SpaceBonus.HEAT,
      {heat: 1},
      {energy: 0, megacredits: 3, heat: 1});
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play - energy', function() {
    expect(() => {
      singleResourceTest(
        SpaceBonus.ENERGY,
        {energy: 1},
        {energy: 1, megacredits: 3});
    }).to.throw(/Unhandled space bonus/);
    expect(player.popWaitingFor()).is.undefined;
  });


  it('play - megacredits', function() {
    expect(() => {
      singleResourceTest(
        SpaceBonus.MEGACREDITS,
        {megacredits: 1},
        {energy: 0, megacredits: 4});
    }).to.throw(/Unhandled space bonus/);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play - 2 of the same', function() {
    singleResourceTest(
      [SpaceBonus.HEAT, SpaceBonus.HEAT],
      {heat: 2},
      {energy: 0, megacredits: 3, heat: 1});
    expect(player.popWaitingFor()).is.undefined;
  });

  it('play - 3 different', function() {
    singleResourceTest(
      [SpaceBonus.HEAT, SpaceBonus.STEEL, SpaceBonus.TITANIUM],
      {heat: 1, steel: 1, titanium: 1},
      {energy: 0, megacredits: 3});
    const orOptions = TestingUtils.cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options.map((option) => option.title)).deep.eq(['heat', 'steel', 'titanium']);
    orOptions.options[0].cb();
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3, heat: 1}));
    expect(player.popWaitingFor()).is.undefined;
  });


  it('play - 3 different, then play Robotic Workforce', function() {
    singleResourceTest(
      [SpaceBonus.HEAT, SpaceBonus.STEEL, SpaceBonus.TITANIUM],
      {heat: 1, steel: 1, titanium: 1},
      {energy: 0, megacredits: 3});
    const orOptions = TestingUtils.cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3, heat: 1}));
    expect(player.popWaitingFor()).is.undefined;

    player.playedCards = [card];

    const roboticWorkforce = new RoboticWorkforce();
    expect(roboticWorkforce.play(player)).is.undefined;
    player.setProductionForTest(Units.of({energy: 1}));
    const selectCard = TestingUtils.cast(roboticWorkforce.play(player), SelectCard);
    expect(selectCard.cards).deep.eq([card]);
    selectCard.cb([selectCard.cards[0]]);
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3, heat: 1}));
  });

  it('play on hazard space', function() {
    player.setProductionForTest({energy: 1});
    player.megaCredits = 8; // Placing on a hazard space costs 8MC

    const hazardSpace = player.game.board.getAvailableSpacesForCity(player)[0];
    hazardSpace.bonus = [SpaceBonus.HEAT];
    hazardSpace.tile = {tileType: TileType.DUST_STORM_MILD, protectedHazard: false};

    const action = card.play(player);

    const selectSpace = TestingUtils.cast(action, SelectSpace);
    expect(selectSpace.availableSpaces).contains(hazardSpace);
    selectSpace.cb(hazardSpace);

    expect(hazardSpace.tile?.tileType).eq(TileType.CITY);
    expect(hazardSpace.player).eq(player);

    TestingUtils.runAllActions(game);
    expect(player.getResourcesForTest()).deep.eq(Units.of({}));
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 3}));
  });

  function singleResourceTest(spaceBonus: SpaceBonus | Array<SpaceBonus>, resources: Partial<Units>, production: Partial<Units>) {
    player.setProductionForTest({energy: 1});
    const action = card.play(player);

    expect(player.getProductionForTest()).deep.eq(Units.of({energy: 0, megacredits: 3}));

    const selectSpace = TestingUtils.cast(action, SelectSpace);
    const space = selectSpace.availableSpaces[0];
    space.bonus = spaceBonus instanceof Array ? spaceBonus : [spaceBonus];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.player).eq(player);
    expect(player.getResourcesForTest()).deep.eq(Units.of(resources));

    TestingUtils.runAllActions(game);

    expect(player.getProductionForTest()).deep.eq(Units.of(production));
  }
});
