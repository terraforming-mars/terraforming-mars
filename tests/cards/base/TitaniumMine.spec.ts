import {expect} from 'chai';
import {TitaniumMine} from '../../../src/server/cards/base/TitaniumMine';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('TitaniumMine', () => {
  it('Should play', () => {
    const card = new TitaniumMine();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(1);
  });
});
