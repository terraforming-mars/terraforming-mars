import {expect} from 'chai';
import {BeginnerCorporation} from '../../../src/server/cards/corporation/BeginnerCorporation';
import {testGame} from '../../TestGame';

describe('BeginnerCorporation', function() {
  it('Should play', function() {
    const card = new BeginnerCorporation();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
