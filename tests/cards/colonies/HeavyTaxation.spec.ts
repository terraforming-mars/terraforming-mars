import {expect} from 'chai';
import {HeavyTaxation} from '../../../src/server/cards/colonies/HeavyTaxation';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('HeavyTaxation', function() {
  it('Should play', function() {
    const card = new HeavyTaxation();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
    expect(player.megaCredits).to.eq(4);
  });
});
