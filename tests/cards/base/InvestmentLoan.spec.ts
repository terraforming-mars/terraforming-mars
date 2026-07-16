import {expect} from 'chai';
import {InvestmentLoan} from '../../../src/server/cards/base/InvestmentLoan';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('InvestmentLoan', () => {
  it('Should play', () => {
    const card = new InvestmentLoan();
    const [game, player] = testGame(2);
    cast(card.play(player), undefined);
    runAllActions(game);
    expect(player.production.megacredits).to.eq(-1);
    expect(player.megaCredits).to.eq(10);
  });
});
