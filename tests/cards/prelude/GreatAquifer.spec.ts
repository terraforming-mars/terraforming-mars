import {expect} from 'chai';
import {GreatAquifer} from '../../../src/cards/prelude/GreatAquifer';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('GreatAquifer', function() {
  it('Should play', function() {
    const card = new GreatAquifer();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
