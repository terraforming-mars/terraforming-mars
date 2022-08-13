import {expect} from 'chai';
import {ReleaseOfInertGases} from '../../../src/server/cards/base/ReleaseOfInertGases';
import {Game} from '../../../src/server/Game';
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
