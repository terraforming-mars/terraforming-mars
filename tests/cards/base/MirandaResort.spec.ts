import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';
import {MirandaResort} from '../../../src/cards/base/MirandaResort';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/Game';

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
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
