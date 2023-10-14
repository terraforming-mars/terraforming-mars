
import {expect} from 'chai';
import {Insulation} from '../../../src/server/cards/base/Insulation';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';

describe('Insulation', function() {
  it('Should play', function() {
    const card = new Insulation();
    const [/* skipped */, player] = testGame(2);

    expect(card.canPlay(player)).is.false;
    player.production.add(Resource.HEAT, 1);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).is.not.undefined;
    if (action === undefined) return;
    action.cb(1);
    expect(player.production.heat).to.eq(0);
    expect(player.production.megacredits).to.eq(1);
  });
});
