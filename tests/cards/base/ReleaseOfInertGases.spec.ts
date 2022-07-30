import {expect} from 'chai';
import {ReleaseOfInertGases} from '../../../src/cards/base/ReleaseOfInertGases';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('ReleaseOfInertGases', function() {
  it('Should play', function() {
    const card = new ReleaseOfInertGases();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(22);
  });
});
