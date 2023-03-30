import {expect} from 'chai';
import {RimFreighters} from '../../../src/server/cards/colonies/RimFreighters';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {testGame} from '../../TestGame';

describe('RimFreighters', function() {
  it('Should play', function() {
    const card = new RimFreighters();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
  });
});
