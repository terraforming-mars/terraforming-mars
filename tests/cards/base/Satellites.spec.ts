import {expect} from 'chai';
import {Satellites} from '../../../src/server/cards/base/Satellites';
import {testGame} from '../../TestGame';

describe('Satellites', function() {
  it('Should play', function() {
    const card = new Satellites();
    const [/* skipped */, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(1);
    player.playedCards.push(card);
    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
