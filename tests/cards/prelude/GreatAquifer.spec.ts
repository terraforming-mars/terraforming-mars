import {expect} from 'chai';
import {GreatAquifer} from '../../../src/server/cards/prelude/GreatAquifer';
import {testGame} from '../../TestGame';

describe('GreatAquifer', function() {
  it('Should play', function() {
    const card = new GreatAquifer();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
