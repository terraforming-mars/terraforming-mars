import {expect} from 'chai';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';
import {TestPlayers} from '../../TestPlayers';

describe('EarthCatapult', function() {
  it('Should play', function() {
    const card = new EarthCatapult();
    const player = TestPlayers.BLUE.newPlayer();

    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

