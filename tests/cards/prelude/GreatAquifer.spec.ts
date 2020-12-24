import {expect} from 'chai';
import {GreatAquifer} from '../../../src/cards/prelude/GreatAquifer';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('GreatAquifer', function() {
  it('Should play', function() {
    const card = new GreatAquifer();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
  });
});
