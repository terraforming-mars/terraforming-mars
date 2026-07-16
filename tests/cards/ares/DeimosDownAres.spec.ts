import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {testGame} from '../../TestGame';
import {DeimosDownAres} from '../../../src/server/cards/ares/DeimosDownAres';
import {AsteroidDeflectionSystem} from '../../../src/server/cards/promo/AsteroidDeflectionSystem';
import {AsteroidRights} from '../../../src/server/cards/promo/AsteroidRights';
import {CardResource} from '../../../src/common/CardResource';

describe('DeimosDownAres', () => {
  let card: DeimosDownAres;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DeimosDownAres();
    [game, player, player2] = testGame(2, {aresExtension: true});
    player.megaCredits = 0;
    player2.megaCredits = 0;
    player.steel = 0;
    player2.steel = 0;
  });

  // Identical to the Deimos Down Promo test
  it('Should play without plants', () => {
    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    const input = player.game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  // Identical to the Deimos Down Promo test
  it('Can remove plants', () => {
    player2.plants = 5;

    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);
    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);

    expect(player.game.deferredActions).has.lengthOf(1);

    // Choose Remove 5 plants option
    const orOptions = cast(player.game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb([player2]);

    expect(player2.plants).to.eq(0);
  });

  // Identical to the Deimos Down Promo test
  it('Works fine in solo mode', () => {
    const [game, player] = testGame(1);

    player.plants = 15;
    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectSpace);

    expect(player.game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player.plants).to.eq(15); // not removed
  });

  it('Adjacency bonus', () => {
    card.play(player);
    runAllActions(game);

    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile?.tileType).to.eq(TileType.DEIMOS_DOWN);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.ASTEROID, SpaceBonus.STEEL]});
  });

  it('Adjacency bonus - Tile Placement - Self', () => {
    player.playedCards.push(new AsteroidDeflectionSystem());
    player2.playedCards.push(new AsteroidRights());

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    player.megaCredits = 0;
    player2.megaCredits = 0;
    player.steel = 0;
    player2.steel = 0;

    // Place tiles from different players next to tile that grants adjacency bonuses
    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    adjacentSpaces[0].bonus = []; // Just in case it had steel bonuses
    game.addGreenery(player, adjacentSpaces[0]);
    runAllActions(game);

    expect(player.megaCredits).to.eq(1); // Owner gets MC bonus

    // Player 1 gets adjacency bonuses
    expect(player.steel).to.eq(1); // 1 Steel for adjacency bonus
    expect(player.getResourceCount(CardResource.ASTEROID)).eq(1);

    // Player 2 gets nothing
    expect(player2.steel).to.eq(0);
    expect(player2.getResourceCount(CardResource.ASTEROID)).eq(0);
  });

  it('Adjacency bonus - Tile Placement - Opponent', () => {
    player.playedCards.push(new AsteroidDeflectionSystem());
    player2.playedCards.push(new AsteroidRights());

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    player.megaCredits = 0;
    player2.megaCredits = 0;
    player.steel = 0;
    player2.steel = 0;

    // Place tiles from different players next to tile that grants adjacency bonuses
    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    adjacentSpaces[0].bonus = []; // Just in case it had steel bonuses
    game.addGreenery(player2, adjacentSpaces[0]);
    runAllActions(game);

    expect(player.megaCredits).to.eq(1); // Owner gets MC bonus

    // Player 1 gets nothing
    expect(player.steel).to.eq(0);
    expect(player.getResourceCount(CardResource.ASTEROID)).eq(0);

    // Player 2 gets adjacency bonuses
    expect(player2.steel).to.eq(1); // 1 Steel for adjacency bonus
    expect(player2.getResourceCount(CardResource.ASTEROID)).eq(1);
  });
});
