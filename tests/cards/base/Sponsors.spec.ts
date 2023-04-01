import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Sponsors} from '../../../src/server/cards/base/Sponsors';

describe('Sponsors', function() {
  it('Should play', function() {
    const card = new Sponsors();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
  });
});
