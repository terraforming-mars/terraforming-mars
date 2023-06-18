import {expect} from 'chai';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('TollStation', function() {
  it('Should play', function() {
    const card = new TollStation();
    const player = TestPlayer.BLUE.newPlayer();
    const anotherPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, anotherPlayer], player);
    cast(card.play(player), undefined);
    anotherPlayer.playedCards.push(card);
    expect(player.production.megacredits).to.eq(0);
    card.play(player);
    expect(player.production.megacredits).to.eq(1);
  });
});
