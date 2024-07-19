import {expect} from 'chai';
import {Eris} from '../../../src/server/cards/community/Eris';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Phase} from '../../../src/common/Phase';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {cast, runAllActions, setRulingParty} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('Eris', () => {
  let card: Eris;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Eris();
    [game, player/* , player2 */] = testGame(2, {aresExtension: true, aresHazards: true});
    card.play(player);
    player.corporations.push(card);
  });

  it('Starts with 1 Ares card', () => {
    card.initialAction(player);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Can act', () => {
    const action = cast(card.action(player), OrOptions);
    const initialHazardsCount = game.board.getHazards().length;
    const initialTR = player.getTerraformRating();

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
    expect(player.getTerraformRating()).eq(initialTR + 1);
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
