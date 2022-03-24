import {expect} from 'chai';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {HousePrinting} from '../../../src/cards/prelude/HousePrinting';
import {SponsoredAcademies} from '../../../src/cards/venusNext/SponsoredAcademies';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayers} from '../../TestPlayers';
import {DiscardCards} from '../../../src/deferredActions/DiscardCards';
import {DrawCards} from '../../../src/deferredActions/DrawCards';
import {TestingUtils} from '../../TestingUtils';

describe('SponsoredAcademies', function() {
  it('Should play', function() {
    const card = new SponsoredAcademies();
    const card2 = new HousePrinting();
    const card3 = new Tardigrades();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    player.cardsInHand.push(card);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    player.cardsInHand.push(card2, card3);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playCard(card);
    const discardCard = game.deferredActions.pop()!.execute() as SelectCard<IProjectCard>;
    expect(discardCard instanceof SelectCard).is.true;

    // No SponsoredAcademies itself suggested to discard
    expect(discardCard.cards.filter((c) => c.name === card.name)).has.lengthOf(0);

    discardCard.cb([card2]);
    TestingUtils.runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player2.cardsInHand).has.lengthOf(1);
  });

  it('triggers in right order', function() {
    const card = new SponsoredAcademies();

    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const player3 = TestPlayers.BLACK.newPlayer();
    const player4 = TestPlayers.GREEN.newPlayer();
    const game = Game.newInstance('foobar', [player, player2, player3, player4], player);

    player.cardsInHand.push(card, new HousePrinting(), new Tardigrades());
    player.playCard(card);

    // If something here doesn't work, it might be linked to the DeferredActionsQueue,
    expect((game.deferredActions.pop() as DiscardCards).title).eq('Select 1 card to discard');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('blue');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('red');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('black');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq('green');
  });
});
