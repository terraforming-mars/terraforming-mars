import {expect} from 'chai';
import {HecateSpeditions} from '../../../src/server/cards/underworld/HecateSpeditions';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {assertBuildColony, assertNoTradeAction, assertTradeAction} from '../../colonies/coloniesAssertions';

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
    expect(card.resourceCount).eq(1);
    cast(player.popWaitingFor(), undefined);
  });

  it('initial action', () => {
    player.deferInitialAction(card);
    runAllActions(game);
    assertBuildColony(player, player.popWaitingFor());
  });

  it('when you play a jovian tag', () => {
    player.corporations.push(card);
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(card.resourceCount).eq(0);
    player.playCard(a);
    expect(card.resourceCount).eq(1);
  });

  it('when opponent plays a building tag', () => {
    player.corporations.push(card);
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.BUILDING]});
    expect(card.resourceCount).eq(0);
    player2.playCard(a);
    expect(card.resourceCount).eq(0);
  });

  it('gain a trade fleet', () => {
    card.resourceCount = 6;

    expect(player.colonies.getFleetSize()).eq(1);

    cast(card.action(player), undefined);

    expect(card.resourceCount).eq(1);
    expect(player.colonies.getFleetSize()).eq(2);
  });

  it('trade', () => {
    assertNoTradeAction(player);

    player.corporations.push(card);
    card.resourceCount = 1;
    assertNoTradeAction(player);

    card.resourceCount = 2;
    assertTradeAction(player, 'Pay 2 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(0);
  });

  it('trade discount', () => {
    player.corporations.push(card);
    card.resourceCount = 2;
    player.colonies.tradeDiscount = 1;

    assertTradeAction(player, 'Pay 1 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(1);
  });

  it('trade discount, min 1', () => {
    player.corporations.push(card);
    card.resourceCount = 2;
    player.colonies.tradeDiscount = 2;

    assertTradeAction(player, 'Pay 1 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(1);
  });

  it('trade more than once in a generation', () => {
    player.corporations.push(card);
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
