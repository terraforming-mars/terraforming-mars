import {expect} from 'chai';
import {SpecializedSettlement} from '../../../src/server/cards/pathfinders/SpecializedSettlement';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {Units} from '../../../src/common/Units';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';
import {OneOrArray} from '../../../src/common/utils/types';

describe('SpecializedSettlement', function() {
  let card: SpecializedSettlement;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new SpecializedSettlement();
    [game, player] = testGame(1, {aresExtension: true, pathfindersExpansion: true});
    game.board = EmptyBoard.newInstance();
    player.popWaitingFor(); // Clears out the default waiting for (selecting initial cards)
  });

  it('Can play', () => {
    player.production.override({energy: 0});
    expect(card.canPlay(player)).is.false;
    player.production.override({energy: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    singleResourceTest(
      SpaceBonus.DRAW_CARD,
      {},
      {energy: 0, megacredits: 3});
    cast(player.popWaitingFor(), undefined);
  });

  it('play - steel', function() {
    singleResourceTest(
      SpaceBonus.STEEL,
      {steel: 1},
      {energy: 0, megacredits: 3, steel: 1});
    cast(player.popWaitingFor(), undefined);
  });

  it('play - titanium', function() {
    singleResourceTest(
      SpaceBonus.TITANIUM,
      {titanium: 1},
      {energy: 0, megacredits: 3, titanium: 1});
    cast(player.popWaitingFor(), undefined);
  });

  it('play - plants', function() {
    singleResourceTest(
      SpaceBonus.PLANT,
      {plants: 1},
      {energy: 0, megacredits: 3, plants: 1});
    cast(player.popWaitingFor(), undefined);
  });

  it('play - heat', function() {
    singleResourceTest(
      SpaceBonus.HEAT,
      {heat: 1},
      {energy: 0, megacredits: 3, heat: 1});
    cast(player.popWaitingFor(), undefined);
  });

  it('play - energy', function() {
    singleResourceTest(
      SpaceBonus.ENERGY,
      {energy: 1},
      {energy: 1, megacredits: 3});
    cast(player.popWaitingFor(), undefined);
  });


  it('play - megacredits', function() {
    expect(() => {
      singleResourceTest(
        SpaceBonus.MEGACREDITS,
        {megacredits: 1},
        {energy: 0, megacredits: 4});
    }).to.throw(/Unhandled space bonus/);
    cast(player.popWaitingFor(), undefined);
  });

  it('play - 2 of the same', function() {
    singleResourceTest(
      [SpaceBonus.HEAT, SpaceBonus.HEAT],
      {heat: 2},
      {energy: 0, megacredits: 3, heat: 1});
    cast(player.popWaitingFor(), undefined);
  });

  it('play - 3 different', function() {
    singleResourceTest(
      [SpaceBonus.HEAT, SpaceBonus.STEEL, SpaceBonus.TITANIUM],
      {heat: 1, steel: 1, titanium: 1},
      {energy: 0, megacredits: 3});
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options.map((option) => option.title)).deep.eq(['heat', 'steel', 'titanium']);
    orOptions.options[0].cb();
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3, heat: 1}));
    cast(player.popWaitingFor(), undefined);
  });

  it('play - 3 different, then play Robotic Workforce', function() {
    singleResourceTest(
      [SpaceBonus.HEAT, SpaceBonus.STEEL, SpaceBonus.TITANIUM],
      {heat: 1, steel: 1, titanium: 1},
      {energy: 0, megacredits: 3});
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3, heat: 1}));
    cast(player.popWaitingFor(), undefined);

    player.playedCards = [card];

    const roboticWorkforce = new RoboticWorkforce();
    expect(roboticWorkforce.canPlay(player)).is.false;

    player.production.override(Units.of({energy: 1}));

    expect(roboticWorkforce.canPlay(player)).is.true;

    cast(roboticWorkforce.play(player), undefined);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).deep.eq([card]);
    selectCard.cb([selectCard.cards[0]]);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3, heat: 1}));
  });

  it('play on hazard space', function() {
    player.production.override({energy: 1});
    player.megaCredits = 8; // Placing on a mild hazard costs 8MC

    const hazardSpace = player.game.board.getAvailableSpacesForCity(player)[0];
    hazardSpace.bonus = [SpaceBonus.HEAT];
    hazardSpace.tile = {tileType: TileType.DUST_STORM_MILD, protectedHazard: false};

    const selectSpace = cast(card.play(player), SelectSpace);
    expect(selectSpace.spaces).contains(hazardSpace);
    selectSpace.cb(hazardSpace);

    expect(hazardSpace.tile?.tileType).eq(TileType.CITY);
    expect(hazardSpace.player).eq(player);

    runAllActions(game);
    expect(player.stock.asUnits()).deep.eq(Units.of({}));
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 3}));
  });

  function singleResourceTest(spaceBonus: OneOrArray<SpaceBonus>, stock: Partial<Units>, production: Partial<Units>) {
    player.production.override({energy: 1});
    const action = card.play(player);

    expect(player.production.asUnits()).deep.eq(Units.of({energy: 0, megacredits: 3}));

    const selectSpace = cast(action, SelectSpace);
    const space = selectSpace.spaces[0];
    space.bonus = spaceBonus instanceof Array ? spaceBonus : [spaceBonus];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.player).eq(player);
    expect(player.stock.asUnits()).deep.eq(Units.of(stock));

    runAllActions(game);

    expect(player.production.asUnits()).deep.eq(Units.of(production));
  }
});
