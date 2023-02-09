import {expect} from 'chai';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {VenusWaystation} from '../../../src/server/cards/venusNext/VenusWaystation';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('VenusWaystation', function() {
  it('Should play', function() {
    const card = new VenusWaystation();
    const card2 = new LocalShading();
    const card3 = new VenusGovernor();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(card.getCardDiscount(player, card2)).to.eq(2);
    expect(card.getCardDiscount(player, card3)).to.eq(4);
  });
});
