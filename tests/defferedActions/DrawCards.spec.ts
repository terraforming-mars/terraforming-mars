import {expect} from 'chai';
import {DrawCards} from '../../src/deferredActions/DrawCards';
import {TestPlayers} from '../TestingUtils';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {AICentral} from '../../src/cards/base/AICentral';
import {Asteroid} from '../../src/cards/base/Asteroid';
import {CapitalAres} from '../../src/cards/ares/CapitalAres';
import {CardType} from '../../src/cards/CardType';
import {Tags} from '../../src/cards/Tags';
import {SelectCard} from '../../src/inputs/SelectCard';

describe('DrawCards', function() {
  let player: Player;
  const cards = [new AICentral(), new Asteroid(), new CapitalAres()];

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  function check(expectedCardsInHand: number, expectedDiscardedCards: number) {
    expect(player.cardsInHand.length).to.eq(expectedCardsInHand);
    expect(player.game.dealer.discarded.length).to.eq(expectedDiscardedCards);
  }

  it('keeps cards', function() {
    DrawCards.keep(player, [cards[0], cards[1]]);
    check(2, 0);
  });

  it('discards cards', function() {
    DrawCards.discard(player, [cards[1]], cards);
    check(0, 2);
  });

  it('draws 3', function() {
    DrawCards.keepAll(player, 3).execute();
    check(3, 0);
  });

  it('draws 3 special', function() {
    DrawCards.keepAll(player, 3, {cardType: CardType.ACTIVE, tag: Tags.SPACE}).execute();
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tags.SPACE) && card.cardType === CardType.ACTIVE).length)
      .to.eq(3);
  });

  it('draws 2 from 4', function() {
    const action = DrawCards.keepSome(player, 4, {keepMax: 2}).execute();
    expect(action instanceof SelectCard).is.true;
    action!.cb([action!.cards[0], action!.cards[2]]);
    check(2, 2);
  });

  it('buys 1', function() {
    player.megaCredits = 3;
    const action = DrawCards.keepSome(player, 1, {paying: true}).execute();
    expect(action instanceof SelectCard).is.true;
    action!.cb([action!.cards[0]]);
    player.game.deferredActions.runNext();
    check(1, 0);
    expect(player.megaCredits).to.eq(0);
  });

  it('cannot buy', function() {
    player.megaCredits = 2;
    const action = DrawCards.keepSome(player, 1, {paying: true}).execute();
    expect(action instanceof SelectCard).is.true;
    expect(action!.maxCardsToSelect).to.eq(0);
    action!.cb([]);
    check(0, 1);
    expect(player.megaCredits).to.eq(2);
  });
});
