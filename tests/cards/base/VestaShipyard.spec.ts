import {expect} from 'chai';
import {VestaShipyard} from '../../../src/server/cards/base/VestaShipyard';
import {testGame} from '../../TestGame';

describe('VestaShipyard', () => {
  it('Should play', () => {
    const card = new VestaShipyard();
    const [/* game */, player] = testGame(2);

    card.play(player);
    expect(player.production.titanium).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
