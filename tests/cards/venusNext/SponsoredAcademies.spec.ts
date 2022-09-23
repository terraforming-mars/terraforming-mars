import {expect} from 'chai';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {SponsoredAcademies} from '../../../src/server/cards/venusNext/SponsoredAcademies';
import {MarsUniversity} from '../../../src/server/cards/base/MarsUniversity';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {DiscardCards} from '../../../src/server/deferredActions/DiscardCards';
import {DrawCards} from '../../../src/server/deferredActions/DrawCards';
import {cast, runAllActions} from '../../TestingUtils';
import {getTestPlayer, getTestPlayers, newTestGame} from '../../TestGame';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from 'tests/TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('SponsoredAcademies', function() {
  let card: SponsoredAcademies;
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let tardigrades: IProjectCard;
  let housePrinting: IProjectCard;

  beforeEach(() => {
    card = new SponsoredAcademies();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.cardsInHand.push(card);
    tardigrades = new Tardigrades();
    housePrinting = new HousePrinting();
  });

  it('Should play', function() {
    player.cardsInHand.push(housePrinting, tardigrades);
    expect(player.canPlayIgnoringCost(card)).is.true;

    player.playCard(card);
    const discardCard = cast(game.deferredActions.pop()!.execute(), SelectCard<IProjectCard>);

    // No SponsoredAcademies itself suggested to discard
    expect(discardCard.cards.filter((c) => c.name === card.name)).has.lengthOf(0);

    discardCard.cb([housePrinting]);
    runAllActions(game); // Draw cards
    expect(player.cardsInHand).has.lengthOf(4);
    expect(player2.cardsInHand).has.lengthOf(1);
  });

  it('triggers in right order', function() {
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

  it('Takes priority over Mars U', () => {
    player.playedCards.push(new MarsUniversity());

    player.cardsInHand.push(tardigrades, housePrinting);
    player.playCard(card);

    // Settle Sponsored Academies effect.
    runAllActions(game);
    const discardCard = cast(player.popWaitingFor(), SelectCard<IProjectCard>);

    expect(player.cardsInHand).has.length(2);

    discardCard.cb([tardigrades]);
    runAllActions(game);

    expect(player.cardsInHand).has.length(4);
    expect(player.cardsInHand).does.not.contain(tardigrades);

    runAllActions(game);

    // Mars U effect starts now.
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);

    selectCard.cb([housePrinting]);
    runAllActions(game);

    expect(player.cardsInHand).does.not.contain(housePrinting);
    expect(player.cardsInHand).has.length(4);
  });
});
