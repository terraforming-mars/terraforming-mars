import {expect} from 'chai';
import {DomeFarming} from '../../../src/server/cards/prelude/DomeFarming';
import {testGame} from '../../TestGame';

describe('DomeFarming', function() {
  it('Should play', function() {
    const card = new DomeFarming();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.plants).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
  });
});
