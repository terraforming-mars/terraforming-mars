import {EcologicalSurvey} from '../../../src/cards/ares/EcologicalSurvey';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {expect} from 'chai';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TileType} from '../../../src/common/TileType';
import {Ants} from '../../../src/cards/base/Ants';
import {Pets} from '../../../src/cards/base/Pets';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ArcticAlgae} from '../../../src/cards/base/ArcticAlgae';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Phase} from '../../../src/common/Phase';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {OceanCity} from '../../../src/cards/ares/OceanCity';

describe('EcologicalSurvey', () => {
  let card : EcologicalSurvey;
  let player : Player;
  let redPlayer : Player;
  let game : Game;

  beforeEach(() => {
    card = new EcologicalSurvey();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Can play', () => {
    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.false;

    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  // This doesn't test anything about this card, but about the behavior this card provides, from
  // AresHandler.
  it('Works with Adjacency Bonuses', () => {
    // tile types in this test are irrelevant.
    // What's key is that this space has a weird behavior - it grants all the bonuses.
    // Only three of them will grant additional bonuses: plants, animals, and microbes.
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [
      SpaceBonus.TITANIUM,
      SpaceBonus.STEEL,
      SpaceBonus.PLANT,
      SpaceBonus.DRAW_CARD,
      SpaceBonus.HEAT,
      SpaceBonus.MEGACREDITS,
      SpaceBonus.ANIMAL,
      SpaceBonus.MICROBE,
      SpaceBonus.POWER,
    ],
    };
    firstSpace.player = player;

    const microbeCard = new Ants();
    const animalCard = new Pets();

    player.playedCards = [card, microbeCard, animalCard];

    // firstSpace tile might grant resources, so resetting all the resource values.
    player.megaCredits = 0;
    player.titanium = 0;
    player.steel = 0;
    player.heat = 0;
    player.energy = 0;
    player.plants = 0;
    player.cardsInHand = [];
    microbeCard.resourceCount = 0;
    animalCard.resourceCount = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).eq(2);
    expect(player.titanium).eq(1);
    expect(player.steel).eq(1);
    expect(player.heat).eq(1);
    expect(player.energy).eq(1);
    expect(player.plants).eq(2);
    expect(player.cardsInHand).is.length(1);
    expect(microbeCard.resourceCount).eq(2);
    expect(animalCard.resourceCount).eq(2);
  });

  it('Works with Space Bonuses', () => {
    // tile types in this test are irrelevant.
    // What's key is that this space has a weird behavior - it grants all the bonuses.
    // Only three of them will grant additional bonuses: steel, titanium, and heat.

    expect(player.titanium).eq(0);
    expect(player.steel).eq(0);
    expect(player.heat).eq(0);
    expect(player.plants).eq(0);
    expect(player.cardsInHand).is.length(0);

    const space = game.board.getAvailableSpacesOnLand(player)[0];
    space.bonus = [
      SpaceBonus.TITANIUM,
      SpaceBonus.STEEL,
      SpaceBonus.PLANT,
      SpaceBonus.DRAW_CARD,
      SpaceBonus.HEAT,
    ],
    player.playedCards = [card];
    game.addTile(player, SpaceType.LAND, space, {tileType: TileType.RESTRICTED_AREA});

    TestingUtils.runAllActions(game);

    expect(player.titanium).eq(1);
    expect(player.steel).eq(1);
    expect(player.heat).eq(1);
    expect(player.plants).eq(2);
    expect(player.cardsInHand).is.length(1);
  });

  it('Bonus not granted when overplacing', () => {
    player.playedCards.push(card);
    const space = game.board.spaces[5];

    // Hand-placing an ocean to make things easy, since this test suite relies on an otherwise empty board.
    space.spaceType = SpaceType.OCEAN;
    space.bonus = [SpaceBonus.PLANT];
    game.simpleAddTile(redPlayer, space, {tileType: TileType.OCEAN});

    player.plants = 0;
    const selectSpace = new OceanCity().play(player);
    selectSpace.cb(space);
    expect(player.plants).eq(0);
  });

  it('Bonus granted with Arctic Algae', () => {
    // Player has Arctic Algae, will grants two plants when anyone plays an ocean.
    player.playedCards.push(new ArcticAlgae());
    player.playedCards.push(card);

    // Hand-placing an ocean to make things easy, since this test suite relies on an otherwise empty board.
    game.board.spaces[5].spaceType = SpaceType.OCEAN;
    game.board.spaces[5].bonus = [];

    player.plants = 0;
    game.addTile(player, SpaceType.OCEAN, game.board.spaces[5], {tileType: TileType.OCEAN});
    TestingUtils.runAllActions(game);
    expect(player.plants).eq(3);
  });

  it('Bonus granted with Arctic Algae not granted during WGT', () => {
    // Player has Arctic Algae, will grants two plants when anyone plays an ocean.
    player.playedCards.push(new ArcticAlgae());
    player.playedCards.push(card);

    // Hand-placing an ocean to make things easy, since this test suite relies on an otherwise empty board.
    game.board.spaces[5].spaceType = SpaceType.OCEAN;
    game.board.spaces[5].bonus = [];

    game.phase = Phase.SOLAR;
    player.plants = 0;
    game.addTile(player, SpaceType.OCEAN, game.board.spaces[5], {tileType: TileType.OCEAN});
    TestingUtils.runAllActions(game);
    expect(player.plants).eq(2);
  });
});
