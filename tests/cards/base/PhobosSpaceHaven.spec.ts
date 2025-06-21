import {expect} from 'chai';
import {PhobosSpaceHaven} from '../../../src/server/cards/base/PhobosSpaceHaven';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('PhobosSpaceHaven', () => {
  it('Should play', () => {
    const card = new PhobosSpaceHaven();
    const [game, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(player.production.titanium).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(3);
    expect(game.board.getCities()).has.length(1);
  });
});
