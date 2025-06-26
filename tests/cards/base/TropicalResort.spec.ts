
import {expect} from 'chai';
import {TropicalResort} from '../../../src/server/cards/base/TropicalResort';
import {Resource} from '../../../src/common/Resource';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('TropicalResort', () => {
  it('Should play', () => {
    const card = new TropicalResort();
    const [/* game */, player] = testGame(1);
    player.production.add(Resource.HEAT, 2);
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
