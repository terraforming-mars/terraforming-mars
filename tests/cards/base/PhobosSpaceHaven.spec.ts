import {expect} from 'chai';
import {PhobosSpaceHaven} from '../../../src/cards/base/PhobosSpaceHaven';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
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
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
    expect(game.getCitiesInPlay()).to.eq(1);
  });
});
