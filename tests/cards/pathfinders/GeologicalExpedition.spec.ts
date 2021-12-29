import {expect} from 'chai';
import {GeologicalExpedition} from '../../../src/cards/pathfinders/GeologicalExpedition';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {ISpace} from '../../../src/boards/ISpace';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {TestingUtils} from '../../TestingUtils';
import {ResourceType} from '../../../src/ResourceType';
import {Units} from '../../../src/Units';
import {OrOptions} from '../../../src/inputs/OrOptions';

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
    microbeCard = TestingUtils.fakeCard({resourceType: ResourceType.MICROBE});
    scienceCard = TestingUtils.fakeCard({resourceType: ResourceType.SCIENCE});
    player.playedCards = [card, microbeCard, scienceCard];
    (player as any).waitingFor = undefined;
    (player as any).waitingForCb = undefined;
  });

  it('no bonuses, gain 1 steel', () => {
    game.addCityTile(player, space.id);

    expect(player.getResourcesForTest()).deep.eq(Units.of({steel: 1}));
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
    TestingUtils.runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.EMPTY);
    expect(microbeCard.resourceCount).eq(0);
    expect(scienceCard.resourceCount).eq(2);
  });

  it('variety', () => {
    space.bonus = [SpaceBonus.MICROBE, SpaceBonus.PLANT, SpaceBonus.HEAT];
    game.addCityTile(player, space.id);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 1, heat: 1}));

    TestingUtils.runAllActions(game);
    const orOptions = TestingUtils.cast(player.getWaitingFor(), OrOptions);
    expect(orOptions.options).has.length(3);
    orOptions.options[0].cb();
    TestingUtils.runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 1, heat: 1}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);

    orOptions.options[1].cb();
    TestingUtils.runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 2, heat: 1}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);

    orOptions.options[2].cb();
    TestingUtils.runAllActions(game);

    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 2, heat: 2}));
    expect(microbeCard.resourceCount).eq(2);
    expect(scienceCard.resourceCount).eq(0);
  });
});
