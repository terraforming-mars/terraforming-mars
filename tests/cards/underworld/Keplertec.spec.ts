import {expect} from 'chai';
import {Keplertec} from '../../../src/server/cards/underworld/Keplertec';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {oneWayDifference} from '../../../src/common/utils/utils';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';

describe('Keplertec', () => {
  it('play', () => {
    const card = new Keplertec();
    const [/* game */, player] = testGame(2);

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.titanium).eq(3);
    expect(player.production.titanium).eq(1);
  });

  it('canAct', () => {
    const card = new Keplertec();
    const [/* game */, player] = testGame(2);
    player.playedCards.push(card);

    expect(card.canAct(player)).is.false;
    player.titanium = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new Keplertec();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const securityFleet = new SecurityFleet();
    player.playedCards.push(card, securityFleet, new Tardigrades());
    player.titanium = 1;
    cast(card.action(player), undefined);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).to.have.members([securityFleet, card]);

    selectCard.cb([securityFleet]);

    expect(securityFleet.resourceCount).eq(1);
    expect(card.resourceCount).eq(0);
    expect(player.titanium).eq(0);
  });

  it('effect', () => {
    const card = new Keplertec();
    const [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);

    // Preload with reliable tokens, first one is draw a card.
    game.underworldData.tokens.push('card1');
    const savedTokens = [...game.underworldData.tokens];
    expect(game.underworldData.tokens).has.length(92);

    player.addResourceTo(card, 1);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(orOptions.options.length).eq(4);
    expect(player.cardsInHand).has.length(0);
    expect(game.underworldData.tokens).has.length(88);

    orOptions.options[0].cb();

    runAllActions(game);

    expect(player.cardsInHand).has.length(1);
    expect(player.underworldData.tokens).deep.eq([
      {'active': false, 'shelter': false, 'token': 'card1'},
    ]);
    expect(game.underworldData.tokens).has.length(91);
    expect(oneWayDifference(savedTokens, game.underworldData.tokens)).deep.eq(['card1']);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('effect, 2 at once', () => {
    const card = new Keplertec();
    const [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);

    // Preload with reliable token.
    game.underworldData.tokens.push('card1');
    const savedTokens = [...game.underworldData.tokens];

    player.addResourceTo(card, 2);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(player.cardsInHand).has.length(0);

    orOptions.options[0].cb();

    expect(player.cardsInHand).has.length(1);
    expect(player.underworldData.tokens).deep.eq([
      {'active': false, 'shelter': false, 'token': 'card1'},
    ]);
    expect(oneWayDifference(savedTokens, game.underworldData.tokens)).deep.eq(['card1']);

    // Preload again with reliable token.
    game.underworldData.tokens.push('card1');

    runAllActions(game);
    const orOptions2 = cast(player.popWaitingFor(), OrOptions);

    orOptions2.options[0].cb();

    expect(player.underworldData.tokens).deep.eq([
      {'active': false, 'shelter': false, 'token': 'card1'},
      {'active': false, 'shelter': false, 'token': 'card1'},
    ]);
    expect(oneWayDifference(savedTokens, game.underworldData.tokens)).deep.eq(['card1']);
    expect(player.cardsInHand).has.length(2);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
