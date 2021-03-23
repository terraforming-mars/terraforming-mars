import {expect} from 'chai';
import {PowerGrid} from '../../../src/cards/base/PowerGrid';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';
import {Game} from '../../../src/Game';

describe('PowerGrid', function() {
  it('Should play', function() {
    const card = new PowerGrid();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    player.game = game;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    player.playedCards.push(card);
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
