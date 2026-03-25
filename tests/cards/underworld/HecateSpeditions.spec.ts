import {expect} from 'chai';
import {HecateSpeditions} from '../../../src/server/cards/underworld/HecateSpeditions';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {assertNoTradeAction, assertTradeAction} from '../../colonies/coloniesAssertions';

describe('HecateSpeditions', () => {
  let card: HecateSpeditions;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new HecateSpeditions();
    [game, player, player2] = testGame(3, {coloniesExtension: true});
  });

  it('play', () => {
    expect(card.resourceCount).eq(0);
    player.playCorporationCard(card);
    runAllActions(game);
    expect(card.resourceCount).eq(3);
    expect(player.colonies.getFleetSize()).eq(2);
    cast(player.popWaitingFor(), undefined);
  });

  it('when you play a jovian tag', () => {
    player.playedCards.push(card);
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(card.resourceCount).eq(0);
    player.playCard(a);
    expect(card.resourceCount).eq(1);
  });

  it('when opponent plays a building tag', () => {
    player.playedCards.push(card);
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.BUILDING]});
    expect(card.resourceCount).eq(0);
    player2.playCard(a);
    expect(card.resourceCount).eq(0);
  });

  it('trade', () => {
    assertNoTradeAction(player);

    player.playedCards.push(card);
    card.resourceCount = 1;
    assertNoTradeAction(player);

    card.resourceCount = 2;
    assertTradeAction(player, 'Pay 2 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(0);
  });

  it('no trade discount', () => {
    player.playedCards.push(card);
    card.resourceCount = 2;
    player.colonies.tradeDiscount = 1;

    assertTradeAction(player, 'Pay 2 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(0);
  });

  it('trade more than once in a generation', () => {
    player.playedCards.push(card);
    card.resourceCount = 6;
    player.colonies.setFleetSize(10);

    assertTradeAction(player, 'Pay 2 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(4);

    assertTradeAction(player, 'Pay 2 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(2);

    assertTradeAction(player, 'Pay 2 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(0);

    assertNoTradeAction(player);
  });
});
