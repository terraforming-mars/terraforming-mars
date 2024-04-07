import {expect} from 'chai';
import {VastitasBorealisNovusBoard} from '../../src/server/boards/VastitasBorealisNovusBoard';
import {addGreenery, cast, runAllActions} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {testGame} from '../TestGame';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {SelectParty} from '../../src/server/inputs/SelectParty';

describe('VastitasBorealisNovusBoard', function() {
  it('Delegate bonuses work without Turmoil', () => {
    const [game, player] = testGame(2, {boardName: BoardName.VASTITAS_BOREALIS_NOVUS});
    const board = cast(game.board, VastitasBorealisNovusBoard);
    const delegateSpace = board.spaces.filter((space) => space.bonus.includes(SpaceBonus.DELEGATE))[0];
    expect(board.getAvailableSpacesOnLand(player, {cost: 0})).includes(delegateSpace);

    addGreenery(player, delegateSpace.id);
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
  });

  it('Delegate bonuses work with Turmoil', () => {
    const [game, player] = testGame(2, {boardName: BoardName.VASTITAS_BOREALIS_NOVUS, turmoilExtension: true});
    const board = cast(game.board, VastitasBorealisNovusBoard);
    const delegateSpace = board.spaces.filter((space) => space.bonus.includes(SpaceBonus.DELEGATE))[0];
    expect(board.getAvailableSpacesOnLand(player, {cost: 0})).includes(delegateSpace);

    addGreenery(player, delegateSpace.id);
    runAllActions(game);
    cast(player.popWaitingFor(), SelectParty);
  });
});
