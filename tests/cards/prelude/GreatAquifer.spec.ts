import {expect} from 'chai';
import {GreatAquifer} from '../../../src/cards/prelude/GreatAquifer';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('GreatAquifer', function() {
  it('Should play', function() {
    const card = new GreatAquifer();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
