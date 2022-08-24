import {expect} from 'chai';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {TestPlayer} from '../../TestPlayer';

describe('HousePrinting', function() {
  it('Should play', function() {
    const card = new HousePrinting();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.production.steel).to.eq(1);
  });
});
