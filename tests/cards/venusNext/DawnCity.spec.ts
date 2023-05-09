import {expect} from 'chai';
import {DawnCity} from '../../../src/server/cards/venusNext/DawnCity';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {testGameOptions} from '../../TestingUtils';

describe('DawnCity', function() {
  it('Should play', function() {
    const card = new DawnCity();
    const [, player] = testGame(2, testGameOptions({venusNextExtension: true}));
    player.production.add(Resource.ENERGY, 1);
    expect(player.simpleCanPlay(card)).is.not.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.energy).to.eq(0);
    expect(player.production.titanium).to.eq(1);
  });
});
