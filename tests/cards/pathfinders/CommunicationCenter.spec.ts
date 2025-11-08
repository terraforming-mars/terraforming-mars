import {expect} from 'chai';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, fakeCard, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {CardType} from '../../../src/common/cards/CardType';
import {CEOsFavoriteProject} from '../../../src/server/cards/base/CEOsFavoriteProject';
import {DataLeak} from '../../../src/server/cards/pathfinders/DataLeak';
import {NobelLabs} from '../../../src/server/cards/pathfinders/NobelLabs';
import {SolarStorm} from '../../../src/server/cards/pathfinders/SolarStorm';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('CommunicationCenter', () => {
  let card: CommunicationCenter;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CommunicationCenter();
    [game, player, player2] = testGame(2, {pathfindersExpansion: true});
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
    player.playedCards.push(card);
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

  it('Works with CEOs favorite project', () => {
    card.resourceCount = 2;
    player.playedCards.push(card);

    const ceosFavoriteProject = new CEOsFavoriteProject();
    player.playCard(ceosFavoriteProject);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.cardsInHand).has.length(1);
    expect(card.resourceCount).eq(1);
  });

  it('card.addResourceTo', () => {
    player.playedCards.push(card);
    card.resourceCount = 2;
    expect(player.cardsInHand).is.length(0);
    player.addResourceTo(card, 8);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
    expect(player.cardsInHand).is.length(3);
  });

  it('Works with data leak', () => {
    card.resourceCount = 2;
    player.playedCards.push(card);

    const dataLeak = new DataLeak();
    player.playCard(dataLeak);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.cardsInHand).has.length(2);
    expect(card.resourceCount).eq(2);
  });

  it('Works with Nobel Labs', () => {
    card.resourceCount = 2;
    const nobelLabs = new NobelLabs();
    player.playedCards.push(card, nobelLabs);

    nobelLabs.action(player);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.cardsInHand).has.length(1);
    expect(card.resourceCount).eq(1);
  });

  it('Can be targeted by Solar Storm before a card is automatically drawn', () => {
    // Solar storm removes data from another player. Since the other player can
    // control order of operations, they get to remove data from Communication Center
    // before this player can remove them.
    card.resourceCount = 2;
    player.playedCards.push(card);
    const solarStorm = new SolarStorm();
    player2.playCard(solarStorm);

    runAllActions(game);

    const orOptions = cast(player2.getWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);
    expect(selectCard.cards).has.members([card]);
    selectCard.cb([card]);
    expect(card.resourceCount).eq(0);

    runAllActions(game);

    expect(player.cardsInHand).has.length(0);
    expect(card.resourceCount).eq(1);
  });

  it('Can be targeted by Solar Storm after adding a resource for playing the event', () => {
    // If Communication Center has 0 or 1 data on it, it is preferential to add one data before removing.
    card.resourceCount = 1;
    player.playedCards.push(card);
    const solarStorm = new SolarStorm();
    player2.playCard(solarStorm);

    runAllActions(game);
    expect(card.resourceCount).eq(2);

    const orOptions = cast(player2.getWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);
    expect(selectCard.cards).has.members([card]);
    selectCard.cb([card]);
    expect(card.resourceCount).eq(0);

    runAllActions(game);

    expect(player.cardsInHand).has.length(0);
    expect(card.resourceCount).eq(0);
  });
});
