import {expect} from 'chai';
import {HousePrinting} from '../../../src/cards/prelude/HousePrinting';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('HousePrinting', function() {
  it('Should play', function() {
    const card = new HousePrinting();
    const player = TestPlayers.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
