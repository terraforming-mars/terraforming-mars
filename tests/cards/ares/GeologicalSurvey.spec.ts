import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {GeologicalSurvey} from '../../../src/server/cards/ares/GeologicalSurvey';
import {Pets} from '../../../src/server/cards/base/Pets';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TileType} from '../../../src/common/TileType';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {addGreenery, setRulingParty, runAllActions, cast, forceGenerationEnd, maxOutOceans, setOxygenLevel, setTemperature} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {OceanCity} from '../../../src/server/cards/ares/OceanCity';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {MAX_TEMPERATURE, MAX_OXYGEN_LEVEL} from '../../../src/common/constants';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('GeologicalSurvey', () => {
  let card: GeologicalSurvey;
  let player: TestPlayer;
  let player2 : TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new GeologicalSurvey();
    [game, player, player2] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();
  });

  it('Can play', () => {
    addGreenery(player);
    expect(card.canPlay(player)).is.true;

    addGreenery(player);
    expect(card.canPlay(player)).is.true;

    addGreenery(player);
    expect(card.canPlay(player)).is.true;

    addGreenery(player);
    expect(card.canPlay(player)).is.true;

    addGreenery(player);
    expect(card.canPlay(player)).is.true;

    addGreenery(player);
    expect(card.canPlay(player)).is.false;
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

    player.playedCards .set(card, microbeCard, animalCard);

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
    player.playedCards.set(card);
    game.addTile(player, space, {tileType: TileType.RESTRICTED_AREA});

    runAllActions(game);

    expect(player.titanium).eq(2);
    expect(player.steel).eq(2);
    expect(player.heat).eq(2);
    expect(player.plants).eq(1);
    expect(player.cardsInHand).is.length(1);
  });

  it('Works with Mars First policy', () => {
    [game, player] = testGame(2, {turmoilExtension: true});

    player.playedCards.push(card);
    game.phase = Phase.ACTION; // Policies are only active in the ACTION phase

    addGreenery(player, '11');
    runAllActions(game);
    expect(player.steel).eq(0);

    setRulingParty(game, PartyName.MARS);
    addGreenery(player, '12');
    runAllActions(game);
    expect(player.steel).eq(2);
  });

  it('Bonus not granted when overplacing', () => {
    player.playedCards.push(card);
    const space = game.board.spaces[5];

    // Hand-placing an ocean to make things easy, since this test suite relies on an otherwise empty board.
    space.spaceType = SpaceType.OCEAN;
    space.bonus = [SpaceBonus.HEAT];
    game.simpleAddTile(player2, space, {tileType: TileType.OCEAN});

    player.heat = 0;
    new OceanCity().play(player);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    selectSpace.cb(space);
    runAllActions(game);
    expect(player.heat).eq(0);
  });


  it('Works during final greenery placement', () => {
    const [game, player/* , player2 */] = testGame(2, {aresExtension: true, aresHazards: false});

    player.playedCards.push(card);
    // Set up end-game conditions
    setTemperature(game, MAX_TEMPERATURE);
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    maxOutOceans(player);
    player.plants = 9;
    player.steel = 0;

    // Pass last turn
    forceGenerationEnd(game);

    // Final greenery placement is considered part of the production phase.
    expect(game.phase).to.eq(Phase.PRODUCTION);
    runAllActions(game);
    const options = cast(player.popWaitingFor(), OrOptions);
    expect(options.title).eq('Place any final greenery from plants');
    const selectSpace = cast(options.options[0], SelectSpace);
    const space = selectSpace.spaces[0];
    space.bonus = [SpaceBonus.STEEL];
    selectSpace.cb(space);

    expect(player.plants).eq(1);
    expect(player.steel).eq(2);
  });
});
