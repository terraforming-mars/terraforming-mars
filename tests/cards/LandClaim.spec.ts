import * as constants from '../../src/constants';
import {expect} from 'chai';
import {BoardName} from '../../src/BoardName';
import {LandClaim} from '../../src/cards/LandClaim';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {SelectSpace} from '../../src/inputs/SelectSpace';
import {SpaceName} from '../../src/SpaceName';
import {setCustomGameOptions} from '../TestingUtils';

describe('LandClaim', function() {
  it('Should play', function() {
    const card = new LandClaim();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.not.undefined;
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    action.cb(landSpace);
    expect(landSpace.player).to.eq(player);
    expect(landSpace.tile).is.undefined;
  });
  it('can claim south pole on hellas board', function() {
    const card = new LandClaim();
    const player = new Player('test', Color.BLUE, false);
    const player2= new Player('text2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player, setCustomGameOptions({
      boardName: BoardName.HELLAS,
    }));
    const action = card.play(player, game) as SelectSpace;
    expect(action).is.not.undefined;
    expect(player.canAfford(constants.HELLAS_BONUS_OCEAN_COST)).to.be.false;
    expect(action.availableSpaces.some((space) => space.id === SpaceName.HELLAS_OCEAN_TILE)).to.be.true;
  });
});
