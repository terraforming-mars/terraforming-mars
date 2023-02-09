import {expect} from 'chai';
import {Satellites} from '../../../src/server/cards/base/Satellites';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';

describe('Satellites', function() {
  it('Should play', function() {
    const card = new Satellites();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.game = game;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(1);
    player.playedCards.push(card);
    card.play(player);
    expect(player.production.megacredits).to.eq(3);
  });
});
