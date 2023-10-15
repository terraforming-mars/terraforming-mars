import {expect} from 'chai';
import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';
import {testGame} from '../../TestGame';

describe('ProtectedHabitats', function() {
  it('Should play', function() {
    const card = new ProtectedHabitats();
    const [/* skipped */, player] = testGame(2);
    expect(card.play(player)).is.undefined;
  });
});
