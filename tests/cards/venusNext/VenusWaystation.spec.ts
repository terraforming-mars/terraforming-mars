import {expect} from 'chai';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {VenusWaystation} from '../../../src/server/cards/venusNext/VenusWaystation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('VenusWaystation', function() {
  it('Should play', function() {
    const card = new VenusWaystation();
    const card2 = new LocalShading();
    const card3 = new VenusGovernor();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    const action = card.play();
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(card.getCardDiscount(player, card2)).to.eq(2);
    expect(card.getCardDiscount(player, card3)).to.eq(4);
  });
});
