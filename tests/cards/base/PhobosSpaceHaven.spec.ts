import {expect} from 'chai';
import {PhobosSpaceHaven} from '../../../src/cards/base/PhobosSpaceHaven';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('PhobosSpaceHaven', function() {
  it('Should play', function() {
    const card = new PhobosSpaceHaven();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(3);
    expect(game.getCitiesCount()).to.eq(1);
  });
});
