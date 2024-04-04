import {EcologicalSurvey} from '../../../src/server/cards/ares/EcologicalSurvey';
import {Game} from '../../../src/server/Game';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Pets} from '../../../src/server/cards/base/Pets';
import {EmptyBoard} from '../../ares/EmptyBoard';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ArcticAlgae} from '../../../src/server/cards/base/ArcticAlgae';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Phase} from '../../../src/common/Phase';
import {addGreenery, cast, forceGenerationEnd, maxOutOceans, runAllActions, setOxygenLevel, setTemperature} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {OceanCity} from '../../../src/server/cards/ares/OceanCity';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {MAX_OXYGEN_LEVEL, MAX_TEMPERATURE} from '../../../src/common/constants';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('EcologicalSurvey', () => {
  let card: EcologicalSurvey;
  let player: TestPlayer;
  let redPlayer : TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new EcologicalSurvey();
    [game, player, redPlayer] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();
  });

  it('Can play', () => {
    addGreenery(player);
    expect(card.canPlay(player)).is.false;

    addGreenery(player);
    expect(card.canPlay(player)).is.false;

    addGreenery(player);
    expect(card.canPlay(player)).is.true;
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
      SpaceBonus.ENERGY,
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
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    runAllActions(game);

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
    game.addTile(player, space, {tileType: TileType.RESTRICTED_AREA});

    runAllActions(game);

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
    new OceanCity().play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

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
    game.addTile(player, game.board.spaces[5], {tileType: TileType.OCEAN});
    runAllActions(game);
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
    game.addTile(player, game.board.spaces[5], {tileType: TileType.OCEAN});
    runAllActions(game);
    expect(player.plants).eq(2);
  });

  it('When logging card card resources, log properly', () => {
    const microbeCard = new Ants();
    player.playedCards = [card, microbeCard];

    const space = game.board.getAvailableSpacesOnLand(player)[0];
    space.bonus = [SpaceBonus.MICROBE],

    game.addTile(player, space, {tileType: TileType.RESTRICTED_AREA});
    runAllActions(game);

    const msg = game.gameLog.pop()!;
    expect(msg.data.length).to.eq(3);
    expect(msg.data[0].value).to.eq(player.color);
    expect(msg.data[1].value).to.eq('Microbe');
    expect(msg.data[2].value).to.eq(card.name);
    expect(msg.message).to.eq('${0} gained a bonus ${1} because of ${2}');
    expect(microbeCard.resourceCount).eq(2);
  });

  it('Works during final greenery placement', () => {
    const [game, player/* , player2 */] = testGame(2, {aresExtension: true, aresHazards: false});

    player.playedCards.push(card);
    // Set up end-game conditions
    setTemperature(game, MAX_TEMPERATURE);
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    maxOutOceans(player);
    player.plants = 9;

    // Pass last turn
    forceGenerationEnd(game);

    // Final greenery placement is considered part of the production phase.
    expect(game.phase).to.eq(Phase.PRODUCTION);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.title).eq('Place any final greenery from plants');
    const selectSpace = cast(options.options[0], SelectSpace);
    const space = selectSpace.spaces[0];
    space.bonus = [SpaceBonus.PLANT];
    selectSpace.cb(space);

    expect(player.plants).eq(3);
  });
});
