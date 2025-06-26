import {expect} from 'chai';
import {PhoboLog} from '../../../src/server/cards/corporation/PhoboLog';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('PhoboLog', () => {
  it('Should play', () => {
    const card = new PhoboLog();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.titanium).to.eq(10);
    expect(player.getTitaniumValue()).to.eq(4);
  });
});
