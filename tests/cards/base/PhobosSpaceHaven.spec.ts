import {expect} from 'chai';
import {PhobosSpaceHaven} from '../../../src/server/cards/base/PhobosSpaceHaven';
import {testGame} from '../../TestGame';

describe('PhobosSpaceHaven', function() {
  it('Should play', function() {
    const card = new PhobosSpaceHaven();
    const [game, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(3);
    expect(game.getCitiesCount()).to.eq(1);
  });
});
