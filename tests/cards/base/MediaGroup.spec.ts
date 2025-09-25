import {expect} from 'chai';
import {MediaGroup} from '../../../src/server/cards/base/MediaGroup';
import {Virus} from '../../../src/server/cards/base/Virus';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {cast} from '../../TestingUtils';

describe('MediaGroup', () => {
  it('Should play', () => {
    const card = new MediaGroup();
    const [game, player] = testGame(2);
    cast(card.play(player), undefined);
    card.onCardPlayed(player, new Virus());

    runAllActions(game);

    expect(player.megaCredits).to.eq(3);

    card.onCardPlayed(player, card);
    runAllActions(game);

    expect(player.megaCredits).to.eq(3);
  });
});
