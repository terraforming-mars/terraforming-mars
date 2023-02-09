import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {MirandaResort} from '../../../src/server/cards/base/MirandaResort';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';

describe('MirandaResort', function() {
  it('Should play', function() {
    const card = new MirandaResort();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    player.game = game;

    player.playedCards.push(new BusinessNetwork());
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });
});
