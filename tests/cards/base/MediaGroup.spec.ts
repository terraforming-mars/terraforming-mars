import {expect} from 'chai';
import {MediaGroup} from '../../../src/server/cards/base/MediaGroup';
import {Virus} from '../../../src/server/cards/base/Virus';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('MediaGroup', function() {
  it('Should play', function() {
    const card = new MediaGroup();
    const [game, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;

    card.onCardPlayed(player, new Virus());

    runAllActions(game);

    expect(player.megaCredits).to.eq(3);

    card.onCardPlayed(player, card);
    runAllActions(game);

    expect(player.megaCredits).to.eq(3);
  });
});
