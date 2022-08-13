import {expect} from 'chai';
import {PowerGrid} from '../../../src/server/cards/base/PowerGrid';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';

describe('PowerGrid', function() {
  it('Should play', function() {
    const card = new PowerGrid();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.game = game;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    player.playedCards.push(card);
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
