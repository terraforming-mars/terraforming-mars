
import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {SpaceStation} from '../../../src/cards/base/SpaceStation';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('SpaceStation', function() {
  it('Should play', function() {
    const card = new SpaceStation();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = new Game('foobar', [player, redPlayer], player);
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    expect(card.getCardDiscount(player, game, card)).to.eq(2);
    expect(card.getCardDiscount(player, game, new Bushes())).to.eq(0);
  });
});
