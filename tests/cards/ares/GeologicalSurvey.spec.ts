import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {GeologicalSurvey} from '../../../src/server/cards/ares/GeologicalSurvey';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {MarsFirst} from '../../../src/server/turmoil/parties/MarsFirst';
import {addGreenery, resetBoard, setRulingPartyAndRulingPolicy, runAllActions, cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {OceanCity} from '../../../src/server/cards/ares/OceanCity';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('GeologicalSurvey', () => {
  let card: GeologicalSurvey;
  let player: TestPlayer;
  let redPlayer : TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new GeologicalSurvey();
    [game, player, redPlayer] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();
  });

  it('Can play', () => {
    addGreenery(player);
    expect(player.simpleCanPlay(card)).is.true;

    addGreenery(player);
    expect(player.simpleCanPlay(card)).is.true;

    addGreenery(player);
    expect(player.simpleCanPlay(card)).is.true;

    addGreenery(player);
    expect(player.simpleCanPlay(card)).is.true;

    addGreenery(player);
    expect(player.simpleCanPlay(card)).is.true;

    addGreenery(player);
    expect(player.simpleCanPlay(card)).is.false;
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
    game.addTile(player, firstSpace, {tileType: TileType.RESTRICTED_AREA});

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
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    runAllActions(game);

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
    game.addTile(player, space, {tileType: TileType.RESTRICTED_AREA});

    runAllActions(game);

    expect(player.titanium).eq(2);
    expect(player.steel).eq(2);
    expect(player.heat).eq(2);
    expect(player.plants).eq(1);
    expect(player.cardsInHand).is.length(1);
  });

  it('Works with Mars First policy', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    const marsFirst = new MarsFirst();

    player.playedCards.push(card);
    game.phase = Phase.ACTION; // Policies are only active in the ACTION phase

    resetBoard(game);

    addGreenery(player, '11');
    runAllActions(game);
    expect(player.steel).eq(0);

    resetBoard(game);

    setRulingPartyAndRulingPolicy(game, turmoil, marsFirst, marsFirst.policies[0].id);
    addGreenery(player, '11');
    runAllActions(game);
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
    new OceanCity().play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    selectSpace.cb(space);
    runAllActions(game);
    expect(player.heat).eq(0);
  });
});
