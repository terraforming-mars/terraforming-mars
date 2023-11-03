import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {IoMiningIndustries} from '../../../src/server/cards/base/IoMiningIndustries';
import {cast} from '../../TestingUtils';

describe('IoMiningIndustries', function() {
  it('Should play', function() {
    const card = new IoMiningIndustries();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);

    expect(player.production.titanium).to.eq(2);
    expect(player.production.megacredits).to.eq(2);
    player.playedCards.push(card);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
