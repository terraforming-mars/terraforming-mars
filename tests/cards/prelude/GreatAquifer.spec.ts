import {expect} from 'chai';
import {GreatAquifer} from '../../../src/cards/prelude/GreatAquifer';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('GreatAquifer', function() {
  it('Should play', function() {
    const card = new GreatAquifer();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
  });
});
