import {expect} from 'chai';
import {SponsoredAcademies} from '../../../src/cards/venusNext/SponsoredAcademies';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {HousePrinting} from '../../../src/cards/prelude/HousePrinting';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {IProjectCard} from '../../../src/cards/IProjectCard';

describe('SponsoredAcademies', function() {
  it('Should play', function() {
    const card = new SponsoredAcademies();
    const card2 = new HousePrinting();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);
    expect(card.canPlay(player)).is.not.true;
    player.cardsInHand.push(card2, card);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player, game) as SelectCard<IProjectCard>;
    expect(action instanceof SelectCard).is.true;

    // No SponsoredAcademies itself suggested to discard
    expect(action.cards.filter((c) => c.name === card.name)).has.lengthOf(0);

    action.cb([card2]);
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player2.cardsInHand).has.lengthOf(1);
  });
});
