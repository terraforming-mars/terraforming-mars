import {expect} from 'chai';
import {PolarIndustries} from '../../../src/server/cards/prelude/PolarIndustries';
import {testGame} from '../../TestGame';

describe('PolarIndustries', function() {
  it('Should play', function() {
    const card = new PolarIndustries();
    const [, player] = testGame(1);

    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.production.heat).to.eq(2);
  });
});
