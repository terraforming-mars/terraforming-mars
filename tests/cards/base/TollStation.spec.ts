import {expect} from 'chai';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {cast, testGame} from '../../TestingUtils';

describe('TollStation', () => {
  it('Should play', () => {
    const card = new TollStation();
    const [/* game */, player, anotherPlayer] = testGame(2);
    cast(card.play(player), undefined);
    anotherPlayer.playedCards.push(card);
    expect(player.production.megacredits).to.eq(0);
    card.play(player);
    expect(player.production.megacredits).to.eq(1);
  });
});
