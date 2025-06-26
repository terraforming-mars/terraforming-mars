import {expect} from 'chai';
import {Keplertec} from '../../../src/server/cards/underworld/Keplertec';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {PersonalSpacecruiser} from '../../../src/server/cards/underworld/PersonalSpacecruiser';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

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
    const [game, player] = testGame(2);

    const personalSpaceCruiser = new PersonalSpacecruiser();
    player.playedCards.push(card, personalSpaceCruiser, new Tardigrades());
    player.titanium = 1;
    cast(card.action(player), undefined);
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).to.have.members([card, personalSpaceCruiser]);

    selectCard.cb([personalSpaceCruiser]);

    expect(personalSpaceCruiser.resourceCount).eq(1);
    expect(card.resourceCount).eq(0);
    expect(player.titanium).eq(0);
  });

  it('effect', () => {
    const card = new Keplertec();
    const [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);

    // Preload with reliable tokens, first one is draw a card.
    game.underworldData.tokens.push('card1');
    const tokens = [...game.underworldData.tokens];

    player.addResourceTo(card, 1);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(player.cardsInHand).has.length(0);

    orOptions.options[0].cb();

    expect(player.cardsInHand).has.length(1);
    expect(game.underworldData.tokens).to.have.members(tokens);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  it('effect, 2 at once', () => {
    const card = new Keplertec();
    const [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);

    // Preload with reliable token.
    game.underworldData.tokens.push('card1');
    const tokens = [...game.underworldData.tokens];

    player.addResourceTo(card, 2);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);

    expect(player.cardsInHand).has.length(0);

    orOptions.options[0].cb();

    expect(player.cardsInHand).has.length(1);
    expect(game.underworldData.tokens).to.have.members(tokens);

    // Preload again with reliable token.
    game.underworldData.tokens.push('card1');

    runAllActions(game);
    const orOptions2 = cast(player.popWaitingFor(), OrOptions);

    orOptions2.options[0].cb();

    expect(player.cardsInHand).has.length(2);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
