import {expect} from 'chai';
import {IoMiningIndustries} from '../../../src/server/cards/base/IoMiningIndustries';
import {TestPlayer} from '../../TestPlayer';

describe('IoMiningIndustries', function() {
  it('Should play', function() {
    const card = new IoMiningIndustries();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(2);
    expect(player.production.megacredits).to.eq(2);
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
