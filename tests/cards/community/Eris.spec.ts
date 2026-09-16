import {expect} from 'chai';
import {Eris} from '../../../src/server/cards/community/Eris';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Phase} from '../../../src/common/Phase';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {runAllActions, setRulingParty} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast} from '../../../src/common/utils/utils';

describe('Eris', () => {
  let card: Eris;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Eris();
    [game, player/* , player2 */] = testGame(2, {aresExtension: true, aresHazards: true});
    card.play(player);
    player.playedCards.push(card);
  });

  it('Starts with 1 Ares card', () => {
    card.initialAction(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Neutral cube does not block hazard placement', () => {
    // A game without starting hazards, so the board around space 15 is predictably empty.
    [game, player] = testGame(2, {aresExtension: true, aresHazards: false});
    card.play(player);
    player.playedCards.push(card);

    const cubeSpace = game.board.getSpaceOrThrow('15');
    const adjacentSpace = game.board.getSpaceOrThrow('08');
    cubeSpace.tile = {tileType: TileType.MARTIAN_NATURE_WONDERS};

    // With no hazards on the board there is only one option, so it resolves directly.
    cast(card.action(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    // The cube is not a tile, so its neighbor is still adjacent to no other tile.
    expect(selectSpace.spaces).contains(adjacentSpace);
    // But a hazard may not be placed on the cube's own space.
    expect(selectSpace.spaces).does.not.contain(cubeSpace);
  });

  it('Can act', () => {
    const action = cast(card.action(player), OrOptions);
    const initialHazardsCount = game.board.getHazards().length;
    const initialTR = player.terraformRating;

    // Place a hazard tile
    action.options[0].cb();
    runAllActions(game);
    const placeHazard = cast(player.popWaitingFor(), SelectSpace);
    placeHazard.cb(placeHazard.spaces[0]);
    expect(game.board.getHazards()).has.length(initialHazardsCount + 1);
    expect(placeHazard.spaces[0].tile?.tileType).eq(TileType.EROSION_MILD);

    // Remove a hazard tile to gain 1 TR
    const removeHazard = cast(action.options[1].cb(), SelectSpace);
    removeHazard.cb(removeHazard.spaces[0]);
    expect(removeHazard.spaces[0].tile).is.undefined;
    expect(game.board.getHazards()).has.length(initialHazardsCount);
    expect(player.terraformRating).eq(initialTR + 1);
  });

  it('Respects Reds', () => {
    [game, player/* , player2 */] = testGame(2, {aresExtension: true, aresHazards: true, turmoilExtension: true});

    game.phase = Phase.ACTION;
    setRulingParty(game, PartyName.REDS);
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    const action = card.action(player);
    expect(action).is.undefined;
    const initialHazardsCount = game.board.getHazards().length;

    // Option to place a hazard tile is auto selected as player cannot afford Reds
    runAllActions(game);
    const placeHazard = cast(player.popWaitingFor(), SelectSpace);
    placeHazard.cb(placeHazard.spaces[0]);
    expect(game.board.getHazards()).has.length(initialHazardsCount + 1);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
