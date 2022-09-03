import {expect} from 'chai';
import {GeologicalExpedition} from '../../../src/server/cards/pathfinders/GeologicalExpedition';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {ISpace} from '../../../src/server/boards/ISpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {CardResource} from '../../../src/common/CardResource';
import {Units} from '../../../src/common/Units';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SpaceName} from '../../../src/server/SpaceName';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('GeologicalExpedition', function() {
  let card: GeologicalExpedition;
  let player: TestPlayer;
  let game: Game;
  let space: ISpace;
  let microbeCard: IProjectCard;
  let scienceCard: IProjectCard;

  beforeEach(function() {
    card = new GeologicalExpedition();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    game.board = EmptyBoard.newInstance();
    space = game.board.getAvailableSpacesOnLand(player)[0];
    microbeCard = fakeCard({resourceType: CardResource.MICROBE});
    scienceCard = fakeCard({resourceType: CardResource.SCIENCE});
    player.playedCards = [card, microbeCard, scienceCard];
    player.popWaitingFor();
  });

  it('no bonuses, gain 1 steel', () => {
    game.addCityTile(player, space.id);

    expect(player.getResourcesForTest()).deep.eq(Units.of({steel: 1}));
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    expect(player.getWaitingFor()).is.undefined;
  });

  it('City tile on a space colony, no bonus', () => {
    game.addCityTile(player, SpaceName.GANYMEDE_COLONY, SpaceType.COLONY);

    expect(game.board.getSpace(SpaceName.GANYMEDE_COLONY).tile?.tileType).eq(TileType.CITY);

    expect(player.getResourcesForTest()).deep.eq(Units.EMPTY);
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    expect(player.getWaitingFor()).is.undefined;
  });

  it('one resource, gain it', () => {
    space.bonus = [SpaceBonus.TITANIUM];
    game.addCityTile(player, space.id);

    expect(player.getResourcesForTest()).deep.eq(Units.of({titanium: 2}));
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    expect(player.getWaitingFor()).is.undefined;
  });

  it('one resource, one non-resource', () => {
    player.cardsInHand = [];
    space.bonus = [SpaceBonus.HEAT, SpaceBonus.DRAW_CARD];
    game.addCityTile(player, space.id);

    expect(player.cardsInHand).has.length(1);
    expect(player.getResourcesForTest()).deep.eq(Units.of({heat: 2}));
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(0);
    expect(player.getWaitingFor()).is.undefined;
  });

  it('one non-resource, no bonus', () => {
    player.cardsInHand = [];
    space.bonus = [SpaceBonus.DRAW_CARD];
    game.addCityTile(player, space.id);

    expect(player.cardsInHand).has.length(1);
    expect(player.getResourcesForTest()).deep.eq(Units.EMPTY);
    expect(player.getWaitingFor()).is.undefined;
  });

  it('three identical resources', () => {
    space.bonus = [SpaceBonus.HEAT, SpaceBonus.HEAT, SpaceBonus.HEAT];
    game.addCityTile(player, space.id);

    expect(player.getResourcesForTest()).deep.eq(Units.of({heat: 4}));
    expect(player.getWaitingFor()).is.undefined;
  });

  it('card resource', () => {
    space.bonus = [SpaceBonus.SCIENCE];
    game.addCityTile(player, space.id);
    runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.EMPTY);
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(2);
  });

  it('variety', () => {
    space.bonus = [SpaceBonus.MICROBE, SpaceBonus.PLANT, SpaceBonus.HEAT];
    game.addCityTile(player, space.id);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 1, heat: 1}));

    runAllActions(game);
    const orOptions = cast(player.getWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(3);
    orOptions.options[0].cb();
    runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 1, heat: 1}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);

    orOptions.options[1].cb();
    runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 2, heat: 1}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);

    orOptions.options[2].cb();
    runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 2, heat: 2}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);
  });
});
