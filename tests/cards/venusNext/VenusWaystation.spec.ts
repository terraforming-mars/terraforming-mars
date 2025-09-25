import {expect} from 'chai';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {VenusWaystation} from '../../../src/server/cards/venusNext/VenusWaystation';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('VenusWaystation', () => {
  it('Should play', () => {
    const card = new VenusWaystation();
    const card2 = new LocalShading();
    const card3 = new VenusGovernor();
    const [/* game */, player] = testGame(2);

    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(card.getCardDiscount(player, card2)).to.eq(2);
    expect(card.getCardDiscount(player, card3)).to.eq(4);
  });
});
