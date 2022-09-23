import {expect} from 'chai';
import {PowerGrid} from '../../../src/server/cards/base/PowerGrid';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {EnergySaving} from '../../../src/server/cards/base/EnergySaving';

describe('PowerGrid', function() {
  it('Should play', function() {
    const card = new PowerGrid();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.game = game;
    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.production.energy).to.eq(1);

    player.playedCards.push(new EnergySaving()); // Also contains a power tag.
    card.play(player);
    expect(player.production.energy).to.eq(3);
  });
});
