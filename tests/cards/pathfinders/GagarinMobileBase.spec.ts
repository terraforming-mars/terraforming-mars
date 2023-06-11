import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {GagarinMobileBase} from '../../../src/server/cards/pathfinders/GagarinMobileBase';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {ISpace} from '../../../src/server/boards/ISpace';
import {TileType} from '../../../src/common/TileType';

describe('GagarinMobileBase', () => {
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: GagarinMobileBase;
  let space13: ISpace;

  beforeEach(() => {
    [game, player, player2] = testGame(2);
    card = new GagarinMobileBase();
    space13 = game.board.getSpace('13');
    player.playedCards = [card];
  });

  it('solo game, initial action includes fewer spaces', () => {
    [game, player] = testGame(1); // 2 players simplifies
    const selectSpace = cast(card.initialAction(player), SelectSpace);
    expect(selectSpace.availableSpaces).to.have.length(57); // 61 - 2 cities - 2 greeneries
  });

  it('initialAction', () => {
    expect(game.gagarinBase).deep.eq([]);
    expect(player.cardsInHand).to.have.length(0);
    const selectSpace = cast(card.initialAction(player), SelectSpace);
    expect(selectSpace.availableSpaces).to.have.length(61);
    selectSpace.process({type: 'space', spaceId: '13'}); // draw two cards
    expect(player.cardsInHand).to.have.length(2);
    expect(game.gagarinBase).deep.eq(['13']);
  });

  it('action', () => {
    game.gagarinBase = ['13'];
    const selectSpace = cast(card.action(player), SelectSpace);
    expect(selectSpace.availableSpaces.map((s) => s.id)).to.have.members(['07', '12', '19', '20']);
    selectSpace.process({type: 'space', spaceId: '07'});
    const selectSpace2 = cast(card.action(player), SelectSpace);
    expect(selectSpace2.availableSpaces.map((s) => s.id)).to.have.members(['06', '12']);
    expect(game.gagarinBase).deep.eq(['07', '13']);
  });

  it('action - blocked in', () => {
    game.gagarinBase = ['13', '07', '19', '12', '20'];
    const selectSpace = cast(card.action(player), SelectSpace);
    expect(selectSpace.availableSpaces.map((s) => s.id)).to.have.members(['06', '11', '18', '26', '27', '28']);
  });

  it('onTilePlaced, self', () => {
    game.gagarinBase = ['13'];
    game.addCity(player, space13);
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('onTilePlaced, opponent', () => {
    game.simpleAddTile(player2, game.board.getSpace('07'), {tileType: TileType.NUCLEAR_ZONE});
    game.gagarinBase = ['13'];
    game.addCity(player2, space13);
    runAllActions(game);
    expect(player2.popWaitingFor()).is.undefined;
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(selectSpace.availableSpaces.map((s) => s.id)).to.have.members(['12', '19', '20']);
  });
});
