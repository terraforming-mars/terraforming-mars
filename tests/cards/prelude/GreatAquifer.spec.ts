import {expect} from 'chai';
import {GreatAquifer} from '../../../src/server/cards/prelude/GreatAquifer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('GreatAquifer', function() {
  it('Should play', function() {
    const card = new GreatAquifer();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
