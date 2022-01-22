import {expect} from 'chai';
import {InvestmentLoan} from '../../../src/cards/base/InvestmentLoan';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('InvestmentLoan', function() {
  it('Should play', function() {
    const card = new InvestmentLoan();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.megaCredits).to.eq(10);
  });
});
