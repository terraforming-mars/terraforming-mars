import {expect} from 'chai';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {HousePrinting} from '../../../src/cards/prelude/HousePrinting';
import {SponsoredAcademies} from '../../../src/cards/venusNext/SponsoredAcademies';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayers} from '../../TestingUtils';

describe('SponsoredAcademies', function() {
  it('Should play', function() {
    const card = new SponsoredAcademies();
    const card2 = new HousePrinting();
    const card3 = new Tardigrades();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    player.cardsInHand.push(card);
    expect(card.canPlay(player)).is.not.true;
    player.cardsInHand.push(card2, card3);
    expect(card.canPlay(player)).is.true;

    player.playCard(card);
    const discardCard = game.deferredActions.shift()!.execute() as SelectCard<IProjectCard>;
    expect(discardCard instanceof SelectCard).is.true;

    // No SponsoredAcademies itself suggested to discard
    expect(discardCard.cards.filter((c) => c.name === card.name)).has.lengthOf(0);

    discardCard.cb([card2]);
    game.deferredActions.runAll(() => {}); // Draw cards
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player2.cardsInHand).has.lengthOf(1);
  });
});
