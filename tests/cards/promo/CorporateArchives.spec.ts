import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {CorporateArchives} from '../../../src/server/cards/promo/CorporateArchives';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('CorporateArchives', function() {
  it('Should play', function() {
    const card = new CorporateArchives();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    const discarded = game.dealer.discarded;
    expect(discarded).is.empty;
    expect(player.megaCredits).eq(0);

    const action = cast(card.play(player), SelectCard<IProjectCard>);
    expect(action.config.min).to.eq(2);
    expect(action.config.max).to.eq(2);

    const cards = action.cards;
    expect(cards).has.length(7);

    action.cb([cards[2], cards[4]]);

    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand).has.members([cards[2], cards[4]]);

    expect(discarded).has.length(5);
    expect(discarded).has.members([cards[0], cards[1], cards[3], cards[5], cards[6]]);
    expect(player.megaCredits).eq(13);
  });
});
