import {expect} from 'chai';
import {PhoboLog} from '../../../src/server/cards/corporation/PhoboLog';
import {testGame} from '../../TestGame';

describe('PhoboLog', function() {
  it('Should play', function() {
    const card = new PhoboLog();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.titanium).to.eq(10);
    expect(player.getTitaniumValue()).to.eq(4);
  });
});
