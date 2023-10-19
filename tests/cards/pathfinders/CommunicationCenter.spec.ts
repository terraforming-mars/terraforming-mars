import {expect} from 'chai';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {CardType} from '../../../src/common/cards/CardType';
import {CEOsFavoriteProject} from '../../../src/server/cards/base/CEOsFavoriteProject';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('CommunicationCenter', function() {
  let card: CommunicationCenter;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CommunicationCenter();
    [game, player, player2] = testGame(2, {pathfindersExpansion: true});
    player.playedCards = [card];
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.false;

    player.production.add(Resource.ENERGY, 1);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    card.resourceCount = 0;
    player.production.add(Resource.ENERGY, 2);

    expect(card.play(player));

    runAllActions(game);

    expect(card.resourceCount).eq(2);
    expect(player.production.energy).eq(1);
  });

  it('onCardPlayed', () => {
    player.playedCards = [card];
    expect(card.resourceCount).eq(0);

    player.onCardPlayed(fakeCard({type: CardType.ACTIVE}));
    runAllActions(game);
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(fakeCard({type: CardType.AUTOMATED}));
    runAllActions(game);
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(fakeCard({type: CardType.CORPORATION}));
    runAllActions(game);
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(fakeCard({type: CardType.PRELUDE}));
    runAllActions(game);
    expect(card.resourceCount).eq(0);

    player.onCardPlayed(fakeCard({type: CardType.EVENT}));
    runAllActions(game);
    expect(card.resourceCount).eq(1);

    player2.onCardPlayed(fakeCard({type: CardType.EVENT}));
    runAllActions(game);
    expect(card.resourceCount).eq(2);

    expect(player.cardsInHand).is.length(0);
    expect(player2.cardsInHand).is.length(0);

    player2.onCardPlayed(fakeCard({type: CardType.EVENT}));
    runAllActions(game);

    expect(card.resourceCount).eq(0);
    expect(player.cardsInHand).is.length(1);
    expect(player2.cardsInHand).is.length(0);
  });

  it('Work with CEOs favorite project', () => {
    player.playedCards = [card];
    player.cardsInHand = [];
    const ceosFavoriteProject = new CEOsFavoriteProject();

    expect(ceosFavoriteProject.canPlay(player)).is.false;
    card.resourceCount = 2;
    expect(ceosFavoriteProject.canPlay(player)).is.true;

    player.playCard(ceosFavoriteProject);
    runAllActions(game);
    expect(card.resourceCount).eq(2);
    const selectCard = cast(player.popWaitingFor(), SelectCard);

    expect(player.cardsInHand).has.length(0);

    selectCard.cb([card]);

    expect(card.resourceCount).eq(0);
    expect(player.cardsInHand).has.length(1);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).eq(1);
  });

  it('card.addResourceTo', () => {
    player.playedCards = [card];
    card.resourceCount = 2;
    expect(player.cardsInHand).is.length(0);
    player.addResourceTo(card, 8);
    expect(card.resourceCount).eq(1);
    expect(player.cardsInHand).is.length(3);
  });
});
