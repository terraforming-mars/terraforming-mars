
import {expect} from 'chai';
import {SubterraneanReservoir} from '../../../src/server/cards/base/SubterraneanReservoir';
import {testGame} from '../../TestGame';

describe('SubterraneanReservoir', function() {
  it('Should play', function() {
    const card = new SubterraneanReservoir();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
