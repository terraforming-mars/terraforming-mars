import {expect} from 'chai';
import {Odyssey} from '../../../src/cards/pathfinders/Odyssey';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';
import {CardType} from '../../../src/common/cards/CardType';
import {ImportOfAdvancedGHG} from '../../../src/cards/base/ImportOfAdvancedGHG';
import {InventionContest} from '../../../src/cards/base/InventionContest';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Resources} from '../../../src/common/Resources';

describe('Odyssey', function() {
  let card: Odyssey;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Odyssey();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.corporationCard = card;
  });

  it('events count for tags', function() {
    const event = TestingUtils.fakeCard({cardType: CardType.EVENT, tags: [Tags.JOVIAN]});
    player.playedCards.push(event);
    expect(player.getTagCount(Tags.JOVIAN)).eq(1);
    player.corporationCard = undefined;
    expect(player.getTagCount(Tags.JOVIAN)).eq(0);
  });

  it('can act', function() {
    expect(card.canAct(player)).is.false;
    const expensiveEvent = TestingUtils.fakeCard({cardType: CardType.EVENT, cost: 17});
    const nonEvent = TestingUtils.fakeCard({cardType: CardType.ACTIVE, cost: 2});
    player.playedCards = [expensiveEvent, nonEvent];
    expect(card.canAct(player)).is.false;
    expensiveEvent.cost = 16;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    // Raise heat 2 steps
    const importOfAdvancedGHG = new ImportOfAdvancedGHG();
    // Look at the top 3 cards from the deck. Take 1 of them into hand and discard the other two.
    const inventionContest = new InventionContest();
    player.playedCards = [importOfAdvancedGHG, inventionContest];
    const selectCard = TestingUtils.cast(card.action(player), SelectCard);

    expect(selectCard.cards).has.members([importOfAdvancedGHG, inventionContest]);
    expect(player.playedCards).has.members([importOfAdvancedGHG, inventionContest]);
    expect(player.getProduction(Resources.HEAT)).eq(0);

    selectCard.cb([importOfAdvancedGHG]);
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.HEAT)).eq(2);
    expect(game.dealer.discarded.pop()).eq(importOfAdvancedGHG);
    expect(player.playedCards).has.members([inventionContest]);
  });
});
