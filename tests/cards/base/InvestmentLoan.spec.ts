import {expect} from 'chai';
import {InvestmentLoan} from '../../../src/server/cards/base/InvestmentLoan';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('InvestmentLoan', function() {
  it('Should play', function() {
    const card = new InvestmentLoan();
    const [game, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    runAllActions(game);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.megaCredits).to.eq(10);
  });
});
