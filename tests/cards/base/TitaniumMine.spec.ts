import {expect} from 'chai';
import {TitaniumMine} from '../../../src/server/cards/base/TitaniumMine';
import {testGame} from '../../TestGame';

describe('TitaniumMine', function() {
  it('Should play', function() {
    const card = new TitaniumMine();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
  });
});
