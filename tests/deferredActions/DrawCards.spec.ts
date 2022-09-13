import {expect} from 'chai';
import {DrawCards} from '../../src/server/deferredActions/DrawCards';
import {TestPlayer} from '../TestPlayer';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {AICentral} from '../../src/server/cards/base/AICentral';
import {Asteroid} from '../../src/server/cards/base/Asteroid';
import {CapitalAres} from '../../src/server/cards/ares/CapitalAres';
import {CardType} from '../../src/common/cards/CardType';
import {Tag} from '../../src/common/cards/Tag';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {ProjectDeck} from '../../src/server/cards/Deck';
import {cast} from '../TestingUtils';

describe('DrawCards', function() {
  let player: Player;
  let projectDeck: ProjectDeck;
  const cards = [new AICentral(), new Asteroid(), new CapitalAres()];

  beforeEach(function() {
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    projectDeck = player.game.projectDeck;
  });


  it('keeps cards', function() {
    DrawCards.keep(player, [cards[0], cards[1]]);
    expect(player.cardsInHand).has.length(2);
    expect(projectDeck.discardPile).has.length(0);
  });

  it('discards cards', function() {
    DrawCards.discard(player, [cards[1]], cards);
    expect(player.cardsInHand).has.length(0);
    expect(projectDeck.discardPile).has.length(2);
  });

  it('draws 3', function() {
    DrawCards.keepAll(player, 3).execute();
    expect(player.cardsInHand).has.length(3);
    expect(projectDeck.discardPile).has.length(0);
  });

  it('draws 3 special', function() {
    DrawCards.keepAll(player, 3, {cardType: CardType.ACTIVE, tag: Tag.SPACE}).execute();
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.SPACE) && card.cardType === CardType.ACTIVE))
      .has.length(3);
  });

  it('draws 2 from 4', function() {
    const action = cast(DrawCards.keepSome(player, 4, {keepMax: 2}).execute(), SelectCard);
    expect(action.config.min).to.eq(2);
    expect(action.config.max).to.eq(2);
    action.cb([action.cards[0], action.cards[2]]);
    expect(player.cardsInHand).has.length(2);
    expect(projectDeck.discardPile).has.length(2);
  });

  it('buys 1', function() {
    player.megaCredits = 3;
    const action = cast(DrawCards.keepSome(player, 1, {paying: true}).execute(), SelectCard);
    expect(action.config.min).to.eq(0);
    expect(action.config.max).to.eq(1);
    action.cb([action.cards[0]]);
    player.game.deferredActions.runNext();
    expect(player.cardsInHand).has.length(1);
    expect(projectDeck.discardPile).has.length(0);
    expect(player.megaCredits).to.eq(0);
  });

  it('cannot buy', function() {
    player.megaCredits = 2;
    const action = cast(DrawCards.keepSome(player, 1, {paying: true}).execute(), SelectCard);
    expect(action.config.min).to.eq(0);
    expect(action.config.max).to.eq(0);
    action.cb([]);
    expect(player.cardsInHand).has.length(0);
    expect(projectDeck.discardPile).has.length(1);
    expect(player.megaCredits).to.eq(2);
  });
});
