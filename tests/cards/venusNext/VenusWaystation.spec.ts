import {expect} from 'chai';
import {LocalShading} from '../../../src/cards/venusNext/LocalShading';
import {VenusGovernor} from '../../../src/cards/venusNext/VenusGovernor';
import {VenusWaystation} from '../../../src/cards/venusNext/VenusWaystation';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('VenusWaystation', function() {
  it('Should play', function() {
    const card = new VenusWaystation();
    const card2 = new LocalShading();
    const card3 = new VenusGovernor();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(card.getCardDiscount(player, card2)).to.eq(2);
    expect(card.getCardDiscount(player, card3)).to.eq(4);
  });
});
