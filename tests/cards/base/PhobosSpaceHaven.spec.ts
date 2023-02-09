import {expect} from 'chai';
import {PhobosSpaceHaven} from '../../../src/server/cards/base/PhobosSpaceHaven';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('PhobosSpaceHaven', function() {
  it('Should play', function() {
    const card = new PhobosSpaceHaven();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(3);
    expect(game.getCitiesCount()).to.eq(1);
  });
});
