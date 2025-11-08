import {expect} from 'chai';
import {MetalsCompany} from '../../../src/server/cards/prelude/MetalsCompany';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MetalsCompany', () => {
  it('Should play', () => {
    const card = new MetalsCompany();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(1);
    expect(player.production.steel).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });
});
