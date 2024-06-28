import {expect} from 'chai';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {testGame} from '../../TestGame';
import {churnAction} from '../../TestingUtils';

describe('Celestic', function() {
  it('Should play', function() {
    const card = new Celestic();
    const [/* game */, player] = testGame(2);
    const play = card.play(player);
    expect(play).is.undefined;

    player.corporations.push(card);

    expect(churnAction(card, player)).is.undefined;
    expect(card.resourceCount).to.eq(1);
    player.addResourceTo(card, 4);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
