import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {GeologicalSurvey} from '../../../src/cards/ares/GeologicalSurvey';
import {Pets} from '../../../src/cards/base/Pets';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/common/Phase';
import {Player} from '../../../src/Player';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {MarsFirst} from '../../../src/turmoil/parties/MarsFirst';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {OceanCity} from '../../../src/cards/ares/OceanCity';

describe('GeologicalSurvey', () => {
  let card : GeologicalSurvey;
  let player : Player;
  let redPlayer : Player;
  let game : Game;

  beforeEach(() => {
    card = new GeologicalSurvey();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = EmptyBoard.newInstance();
  });

  it('Can play', () => {
    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    TestingUtils.addGreenery(player);
    expect(player.canPlayIgnoringCost(card)).is.false;
  });


  it('Works with Adjacency Bonuses', () => {
    // tile types in this test are irrelevant.
    // What's key is that this space has a weird behavior - it grants all the bonuses.
    // Only three of them will grant additional bonuses: steel, titanium, and heat.

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
      SpaceBonus.ENERGY,
    ],
    };
    game.addTile(player, SpaceType.LAND, firstSpace, {tileType: TileType.RESTRICTED_AREA});

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
    player.cardsInHand = []; 0;
    microbeCard.resourceCount = 0;
    animalCard.resourceCount = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).eq(2);
    expect(player.titanium).eq(2);
    expect(player.steel).eq(2);
    expect(player.heat).eq(2);
    expect(player.energy).eq(1);
    expect(player.plants).eq(1);
    expect(player.cardsInHand).is.length(1);
    expect(microbeCard.resourceCount).eq(1);
    expect(animalCard.resourceCount).eq(1);
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

    expect(player.titanium).eq(2);
    expect(player.steel).eq(2);
    expect(player.heat).eq(2);
    expect(player.plants).eq(1);
    expect(player.cardsInHand).is.length(1);
  });

  it('Works with Mars First policy', () => {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    const turmoil = game.turmoil!;
    const marsFirst = new MarsFirst();

    player.playedCards.push(card);
    game.phase = Phase.ACTION; // Policies are only active in the ACTION phase

    TestingUtils.resetBoard(game);

    game.addGreenery(player, '11');
    TestingUtils.runAllActions(game);
    expect(player.steel).eq(0);

    TestingUtils.resetBoard(game);

    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, marsFirst, marsFirst.policies[0].id);
    game.addGreenery(player, '11');
    TestingUtils.runAllActions(game);
    expect(player.steel).eq(2);
  });

  it('Bonus not granted when overplacing', () => {
    player.playedCards.push(card);
    const space = game.board.spaces[5];

    // Hand-placing an ocean to make things easy, since this test suite relies on an otherwise empty board.
    space.spaceType = SpaceType.OCEAN;
    space.bonus = [SpaceBonus.HEAT];
    game.simpleAddTile(redPlayer, space, {tileType: TileType.OCEAN});

    player.heat = 0;
    const selectSpace = new OceanCity().play(player);
    selectSpace.cb(space);
    TestingUtils.runAllActions(game);
    expect(player.heat).eq(0);
  });
});
