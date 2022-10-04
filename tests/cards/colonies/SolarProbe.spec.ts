import {Tag} from '../../../src/common/cards/Tag';
import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {SolarProbe} from '../../../src/server/cards/colonies/SolarProbe';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SolarProbe', function() {
  it('Should play', function() {
    const card = new SolarProbe();
    const research = new Research();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 1);

    player.playedCards.push(research);

    expect(player.tags.count(Tag.SCIENCE)).eq(2);

    // Since Solar Probe is an event, the card still allows its tag to count.
    const action = card.play(player);

    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);

    // This part shows that it draws one card per 3 tags.
    player.playedCards = [];
    player.cardsInHand = [];
    player.playedCards.push(research);
    player.playedCards.push(research);
    player.playedCards.push(research);

    expect(player.tags.count(Tag.SCIENCE)).eq(6);

    card.play(player);

    expect(player.cardsInHand).has.lengthOf(2);
  });
});
