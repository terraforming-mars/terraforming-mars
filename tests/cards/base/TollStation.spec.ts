import {expect} from 'chai';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('TollStation', function() {
  it('Should play', function() {
    const card = new TollStation();
    const player = TestPlayers.BLUE.newPlayer();
    const anotherPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, anotherPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    anotherPlayer.playedCards.push(card);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
