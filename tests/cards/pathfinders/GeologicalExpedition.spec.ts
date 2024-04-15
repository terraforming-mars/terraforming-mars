import {expect} from 'chai';
import {GeologicalExpedition} from '../../../src/server/cards/pathfinders/GeologicalExpedition';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {Space} from '../../../src/server/boards/Space';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {addCity, cast, fakeCard, runAllActions} from '../../TestingUtils';
import {CardResource} from '../../../src/common/CardResource';
import {Units} from '../../../src/common/Units';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SpaceName} from '../../../src/server/SpaceName';
import {TileType} from '../../../src/common/TileType';

describe('GeologicalExpedition', function() {
  let card: GeologicalExpedition;
  let player: TestPlayer;
  let game: Game;
  let space: Space;
  let microbeCard: IProjectCard;
  let scienceCard: IProjectCard;

  beforeEach(function() {
    card = new GeologicalExpedition();
    [game, player] = testGame(1);
    game.board = EmptyBoard.newInstance();
    space = game.board.getAvailableSpacesOnLand(player)[0];
    microbeCard = fakeCard({resourceType: CardResource.MICROBE});
    scienceCard = fakeCard({resourceType: CardResource.SCIENCE});
    player.playedCards = [card, microbeCard, scienceCard];
    player.popWaitingFor();
  });

  it('no bonuses, gain 1 steel', () => {
    game.addCity(player, space);

    expect(player.stock.asUnits()).deep.eq(Units.of({steel: 1}));
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    cast(player.getWaitingFor(), undefined);
  });

  it('City tile on a space colony, no bonus', () => {
    addCity(player, SpaceName.GANYMEDE_COLONY);

    expect(game.board.getSpaceOrThrow(SpaceName.GANYMEDE_COLONY).tile?.tileType).eq(TileType.CITY);

    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    cast(player.getWaitingFor(), undefined);
  });

  it('one resource, gain it', () => {
    space.bonus = [SpaceBonus.TITANIUM];
    game.addCity(player, space);

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 2}));
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    cast(player.getWaitingFor(), undefined);
  });

  it('one resource, one non-resource', () => {
    player.cardsInHand = [];
    space.bonus = [SpaceBonus.HEAT, SpaceBonus.DRAW_CARD];
    game.addCity(player, space);

    expect(player.cardsInHand).has.length(1);
    expect(player.stock.asUnits()).deep.eq(Units.of({heat: 2}));
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    cast(player.getWaitingFor(), undefined);
  });

  it('one non-resource, no bonus', () => {
    player.cardsInHand = [];
    space.bonus = [SpaceBonus.DRAW_CARD];
    game.addCity(player, space);

    expect(player.cardsInHand).has.length(1);
    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    cast(player.getWaitingFor(), undefined);
  });

  it('three identical resources', () => {
    space.bonus = [SpaceBonus.HEAT, SpaceBonus.HEAT, SpaceBonus.HEAT];
    game.addCity(player, space);

    expect(player.stock.asUnits()).deep.eq(Units.of({heat: 4}));
    cast(player.getWaitingFor(), undefined);
  });

  it('card resource', () => {
    space.bonus = [SpaceBonus.SCIENCE];
    game.addCity(player, space);
    runAllActions(game);

    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(2);
  });

  it('variety', () => {
    space.bonus = [SpaceBonus.MICROBE, SpaceBonus.PLANT, SpaceBonus.HEAT];
    game.addCity(player, space);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1, heat: 1}));

    runAllActions(game);
    const orOptions = cast(player.getWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(3);
    orOptions.options[0].cb();
    runAllActions(game);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 1, heat: 1}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);

    orOptions.options[1].cb();
    runAllActions(game);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 2, heat: 1}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);

    orOptions.options[2].cb();
    runAllActions(game);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 2, heat: 2}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);
  });
});
