import {expect} from 'chai';
import {DrawCards} from '../../src/server/deferredActions/DrawCards';
import {TestPlayer} from '../TestPlayer';
import {IGame} from '../../src/server/IGame';
import {CardType} from '../../src/common/cards/CardType';
import {Tag} from '../../src/common/cards/Tag';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {ProjectDeck} from '../../src/server/cards/Deck';
import {cast, formatMessage, runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('DrawCards', function() {
  let game: IGame;
  let player: TestPlayer;
  let projectDeck: ProjectDeck;

  beforeEach(function() {
    [game, player] = testGame(2);
    projectDeck = player.game.projectDeck;
  });

  it('draws 3', function() {
    DrawCards.keepAll(player, 3).execute();
    expect(player.cardsInHand).has.length(3);
    expect(projectDeck.discardPile).has.length(0);
  });

  it('draws 3 special', function() {
    DrawCards.keepAll(player, 3, {cardType: CardType.ACTIVE, tag: Tag.SPACE}).execute();
    expect(player.cardsInHand).has.length(3);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.SPACE) && card.type === CardType.ACTIVE))
      .has.length(3);
  });

  it('draws 2 from 4', function() {
    cast(DrawCards.keepSome(player, 4, {keepMax: 2}).execute(), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    expect(action.config.min).to.eq(2);
    expect(action.config.max).to.eq(2);
    action.cb([action.cards[0], action.cards[2]]);
    expect(player.cardsInHand).has.length(2);
    expect(projectDeck.discardPile).has.length(2);
  });

  it('buys 1', function() {
    player.megaCredits = 3;
    cast(DrawCards.keepSome(player, 1, {paying: true}).execute(), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);

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
    cast(DrawCards.keepSome(player, 1, {paying: true}).execute(), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    expect(action.config.min).to.eq(0);
    expect(action.config.max).to.eq(0);
    action.cb([]);
    expect(player.cardsInHand).has.length(0);
    expect(projectDeck.discardPile).has.length(1);
    expect(player.megaCredits).to.eq(2);
  });

  it('drawn cards are privately logged', () => {
    game.gameLog = [];
    DrawCards.keepAll(player).execute();

    expect(game.gameLog).has.length(2);

    // Since the gameLog has two entries, these two filters account for both of them.
    const privateMessage = game.gameLog.filter((entry) => entry.playerId === player.id)[0];
    expect(formatMessage(privateMessage)).matches(/You drew .*/);

    const publicMessage = game.gameLog.filter((entry) => entry.playerId === undefined)[0];
    expect(formatMessage(publicMessage)).eq('blue drew 1 card(s)');
  });

  it('drawn cards are privately logged, even with options, if undefined', () => {
    game.gameLog = [];
    DrawCards.keepAll(player, 2, {tag: undefined}).execute();

    expect(game.gameLog).has.length(2);

    // Since the gameLog has two entries, these two filters account for both of them.
    const privateMessage = game.gameLog.filter((entry) => entry.playerId === player.id)[0];
    expect(formatMessage(privateMessage)).matches(/You drew .* and .*/);

    const publicMessage = game.gameLog.filter((entry) => entry.playerId === undefined)[0];
    expect(formatMessage(publicMessage)).eq('blue drew 2 card(s)');
  });

  it('drawn cards are publicly logged, when options are defined', () => {
    game.gameLog = [];
    DrawCards.keepAll(player, 2, {tag: undefined, cardType: CardType.ACTIVE}).execute();

    expect(game.gameLog).has.length(2);

    const discardMessage = game.gameLog[0];
    expect(formatMessage(discardMessage)).matches(/.* card\(s\) were discarded/);

    const publicMessage = game.gameLog[1];
    expect(formatMessage(publicMessage)).matches(/blue drew .* and .*/);
  });
});
