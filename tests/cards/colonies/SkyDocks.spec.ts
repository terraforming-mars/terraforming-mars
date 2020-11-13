import {expect} from 'chai';
import {SkyDocks} from '../../../src/cards/colonies/SkyDocks';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';

describe('SkyDocks', function() {
  it('Should play', function() {
    const card = new SkyDocks();
    const player = new Player('test', Color.BLUE, false);
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.fleetSize).to.eq(2);
    expect(card.getCardDiscount()).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
