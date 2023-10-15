import {expect} from 'chai';
import {DawnCity} from '../../../src/server/cards/venusNext/DawnCity';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {cast} from '../../TestingUtils';

describe('DawnCity', function() {
  it('Should play', function() {
    const card = new DawnCity();
    const [/* skipped */, player] = testGame(2, {venusNextExtension: true});
    player.production.add(Resource.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.not.true;

    cast(card.play(player), undefined);
    expect(player.production.energy).to.eq(0);
    expect(player.production.titanium).to.eq(1);
  });
});
