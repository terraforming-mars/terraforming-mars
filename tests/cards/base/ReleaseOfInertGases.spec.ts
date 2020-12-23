import {expect} from 'chai';
import {ReleaseOfInertGases} from '../../../src/cards/base/ReleaseOfInertGases';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('ReleaseOfInertGases', function() {
  it('Should play', function() {
    const card = new ReleaseOfInertGases();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(22);
  });
});
