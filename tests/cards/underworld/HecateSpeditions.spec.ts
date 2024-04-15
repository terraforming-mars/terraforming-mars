import {expect} from 'chai';
import {HecateSpeditions} from '../../../src/server/cards/underworld/HecateSpeditions';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('HecateSpeditions', function() {
  let card: HecateSpeditions;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new HecateSpeditions();
    [game, player, player2] = testGame(3, {coloniesExtension: true});
  });

  it('play', function() {
    expect(card.resourceCount).eq(0);
    player.playCorporationCard(card);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
    cast(player.popWaitingFor(), undefined);
  });

  it('initial action', function() {
    player.deferInitialAction(card);
    runAllActions(game);
    UnderworldTestHelper.assertBuildColony(player, player.popWaitingFor());
  });

  it('when you play a jovian tag', function() {
    player.setCorporationForTest(card);
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(card.resourceCount).eq(0);
    player.playCard(a);
    expect(card.resourceCount).eq(1);
  });

  it('when opponent plays a building tag', function() {
    player.setCorporationForTest(card);
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
    UnderworldTestHelper.assertNoTradeAction(player);

    player.setCorporationForTest(card);
    card.resourceCount = 1;
    UnderworldTestHelper.assertNoTradeAction(player);

    card.resourceCount = 2;
    UnderworldTestHelper.assertTradeAction(player, 'Pay 2 supply chain resources (use Hecate Speditions action)');
    expect(card.resourceCount).eq(0);
  });
});
