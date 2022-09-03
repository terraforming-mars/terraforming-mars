import {expect} from 'chai';
import {BoardName} from '../../../src/common/boards/BoardName';
import {LandClaim} from '../../../src/server/cards/base/LandClaim';
import * as constants from '../../../src/common/constants';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceName} from '../../../src/server/SpaceName';
import {cast, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('LandClaim', function() {
  it('Should play', function() {
    const card = new LandClaim();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = cast(card.play(player), SelectSpace);
    const landSpace = player.game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(landSpace);
    expect(landSpace.player).to.eq(player);
    expect(landSpace.tile).is.undefined;
  });
  it('can claim south pole on hellas board', function() {
    const card = new LandClaim();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player, setCustomGameOptions({
      boardName: BoardName.HELLAS,
    }));
    const action = cast(card.play(player), SelectSpace);
    expect(player.canAfford(constants.HELLAS_BONUS_OCEAN_COST)).to.be.false;
    expect(action.availableSpaces.some((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.be.true;
  });
});
