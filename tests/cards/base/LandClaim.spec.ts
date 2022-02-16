import {expect} from 'chai';
import {BoardName} from '../../../src/common/boards/BoardName';
import {LandClaim} from '../../../src/cards/base/LandClaim';
import * as constants from '../../../src/common/constants';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {SpaceName} from '../../../src/SpaceName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('LandClaim', function() {
  it('Should play', function() {
    const card = new LandClaim();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.not.undefined;
    const landSpace = player.game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(landSpace);
    expect(landSpace.player).to.eq(player);
    expect(landSpace.tile).is.undefined;
  });
  it('can claim south pole on hellas board', function() {
    const card = new LandClaim();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions({
      boardName: BoardName.HELLAS,
    }));
    const action = card.play(player) as SelectSpace;
    expect(action).is.not.undefined;
    expect(player.canAfford(constants.HELLAS_BONUS_OCEAN_COST)).to.be.false;
    expect(action.availableSpaces.some((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.be.true;
  });
});
