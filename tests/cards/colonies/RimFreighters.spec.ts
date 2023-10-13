import {expect} from 'chai';
import {RimFreighters} from '../../../src/server/cards/colonies/RimFreighters';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('RimFreighters', function() {
  it('Should play', function() {
    const card = new RimFreighters();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
  });
});
