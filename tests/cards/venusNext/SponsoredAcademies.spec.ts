import {expect} from 'chai';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {SponsoredAcademies} from '../../../src/server/cards/venusNext/SponsoredAcademies';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {DiscardCards} from '../../../src/server/deferredActions/DiscardCards';
import {DrawCards} from '../../../src/server/deferredActions/DrawCards';
import {cast, runAllActions} from '../../TestingUtils';
import {getTestPlayer, getTestPlayers, newTestGame} from '../../TestGame';

describe('SponsoredAcademies', function() {
  it('Should play', function() {
    const card = new SponsoredAcademies();
    const card2 = new HousePrinting();
    const card3 = new Tardigrades();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    const player2 = getTestPlayer(game, 1);
    player.cardsInHand.push(card);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    player.cardsInHand.push(card2, card3);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playCard(card);
    const discardCard = cast(game.deferredActions.pop()!.execute(), SelectCard<IProjectCard>);
    expect(discardCard instanceof SelectCard).is.true;

    // No SponsoredAcademies itself suggested to discard
    expect(discardCard.cards.filter((c) => c.name === card.name)).has.lengthOf(0);

    discardCard.cb([card2]);
    runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player2.cardsInHand).has.lengthOf(1);
  });

  it('triggers in right order', function() {
    const card = new SponsoredAcademies();

    const game = newTestGame(4);
    const [player, player2, player3, player4] = getTestPlayers(game);

    player.cardsInHand.push(card, new HousePrinting(), new Tardigrades());
    player.playCard(card);

    // If something here doesn't work, it might be linked to the DeferredActionsQueue,
    expect((game.deferredActions.pop() as DiscardCards).title).eq('Select 1 card to discard');
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq(player.color);
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq(player2.color);
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq(player3.color);
    expect((game.deferredActions.pop() as DrawCards<any>).player.color).eq(player4.color);
  });
});
