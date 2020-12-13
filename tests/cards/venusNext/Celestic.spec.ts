import {expect} from 'chai';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('Celestic', function() {
  it('Should play', function() {
    const card = new Celestic();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = new Game('foobar', [player, redPlayer], player);
    const play = card.play();
    expect(play).is.undefined;

    player.corporationCard = card;

    const action = card.action(player, game);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);
    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
