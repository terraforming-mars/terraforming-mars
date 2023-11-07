import {expect} from 'chai';
import {PersonalSpacecruiser} from '../../../src/server/cards/underworld/PersonalSpacecruiser';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('PersonalSpacecruiser', () => {
  it('play', () => {
    const card = new PersonalSpacecruiser();
    const [game, player] = testGame(2);

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).eq(1);
    expect(player.underworldData.corruption).to.eq(1);
  });

  it('production phase, no corruption', () => {
    const card = new PersonalSpacecruiser();
    const [/* game */, player] = testGame(2);

    player.playedCards.push(card);
    card.resourceCount = 1;
    player.underworldData.corruption = 0;
    card.onProductionPhase(player);

    expect(player.megaCredits).eq(0);
  });

  it('production phase, no fighter', () => {
    const card = new PersonalSpacecruiser();
    const [/* game */, player] = testGame(2);

    player.playedCards.push(card);
    card.resourceCount = 0;
    player.underworldData.corruption = 1;
    card.onProductionPhase(player);

    expect(player.megaCredits).eq(0);
  });

  it('production phase', () => {
    const card = new PersonalSpacecruiser();
    const [/* game */, player] = testGame(2);

    player.playedCards.push(card);
    card.resourceCount = 1;
    player.underworldData.corruption = 4;
    card.onProductionPhase(player);

    expect(player.megaCredits).eq(8);
  });

  it('production phase, no corruption', () => {
    const card = new PersonalSpacecruiser();
    const [/* game */, player] = testGame(2);

    player.playedCards.push(card);
    card.resourceCount = 2;
    player.underworldData.corruption = 4;
    card.onProductionPhase(player);

    expect(player.megaCredits).eq(8);
  });
});
