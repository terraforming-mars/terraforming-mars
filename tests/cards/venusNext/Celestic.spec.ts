import {expect} from 'chai';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {testGame} from '../../TestGame';
import {cast, churn} from '../../TestingUtils';

describe('Celestic', () => {
  it('Should play', () => {
    const card = new Celestic();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
    player.corporations.push(card);

    expect(churn(card.action(player), player)).is.undefined;
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card, 4);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
