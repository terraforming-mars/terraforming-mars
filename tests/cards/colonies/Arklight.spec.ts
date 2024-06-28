import {expect} from 'chai';
import {Predators} from '../../../src/server/cards/base/Predators';
import {Arklight} from '../../../src/server/cards/colonies/Arklight';
import {runAllActions, testGame} from '../../TestingUtils';

describe('Arklight', function() {
  it('Should play', function() {
    const card = new Arklight();
    const [game, player/* , player2 */] = testGame(2);
    const play = card.play(player);
    expect(play).is.undefined;
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    player.corporations.push(card);
    card.onCardPlayed(player, new Predators());
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
