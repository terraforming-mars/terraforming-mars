
import {expect} from 'chai';
import {PhobosSpaceHaven} from '../../../src/cards/base/PhobosSpaceHaven';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('PhobosSpaceHaven', function() {
  it('Should play', function() {
    const card = new PhobosSpaceHaven();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
    expect(game.getCitiesInPlay()).to.eq(1);
  });
});
