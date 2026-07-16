import {expect} from 'chai';
import {AnubisSecurities} from '../../../src/server/cards/underworld/AnubisSecurities';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {Ants} from '../../../src/server/cards/base/Ants';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';

describe('AnubisSecurities', () => {
  it('First action', () => {
    const card = new AnubisSecurities();
    const [/* game */, player] = testGame(2);
    player.playedCards.push(card);

    // AI Central needs 3 science tags.
    const aiCentral = new AICentral();
    // Ants needs 4% oxygen
    const ants = new Ants();
    player.cardsInHand = [aiCentral, ants];
    player.megaCredits = Math.max(aiCentral.cost, ants.cost);

    expect(player.canPlay(aiCentral)).is.false;
    expect(player.canPlay(ants)).is.false;

    cast(card.initialAction(player), undefined);
    runAllActions(player.game);
    const selectProjectCardToPlay = cast(player.popWaitingFor(), SelectProjectCardToPlay);

    expect(selectProjectCardToPlay.cards).deep.eq([ants]);
    // Anubis Securities doesn't touch tag requirements.
    expect(player.canPlay(aiCentral)).is.false;
    // But it does touch global requirements.
    expect(player.canPlay(ants)).is.true;

    // TODO(kberg): Add test that selects the card, and then shows that the global parameter
    // bonus no longer applies.
  });

  it('TR effect, self', () => {
    const card = new AnubisSecurities();
    const [/* game */, player] = testGame(2);

    player.playedCards.push(card);
    player.megaCredits = 0;

    player.increaseTerraformRating(1);
    expect(player.megaCredits).eq(2);

    player.increaseTerraformRating(2);
    expect(player.megaCredits).eq(6);
  });

  it('TR effect, opponent', () => {
    const card = new AnubisSecurities();
    const [/* game */, player, player2] = testGame(2);

    player.playedCards.push(card);
    player.megaCredits = 0;
    player2.megaCredits = 0;

    player2.increaseTerraformRating(1);
    expect(player2.megaCredits).eq(2);
    expect(player.megaCredits).eq(0);

    player2.increaseTerraformRating(2);
    expect(player2.megaCredits).eq(6);
    expect(player.megaCredits).eq(0);

    // Only works when the player has the lowest corruption.
    player2.underworldData.corruption = 1;

    player2.increaseTerraformRating(2);
    expect(player2.megaCredits).eq(6);
    expect(player.megaCredits).eq(0);
  });

  it('canAct', () => {
    const card = new AnubisSecurities();
    const [/* game */, player] = testGame(2);
    player.playedCards.push(card);
    player.underworldData.corruption = 0;
    expect(card.canAct(player)).is.false;
    player.underworldData.corruption = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new AnubisSecurities();
    const [/* game */, player] = testGame(2);
    player.playedCards.push(card);
    player.underworldData.corruption = 3;
    player.megaCredits = 0;

    card.action(player);
    runAllActions(player.game);

    expect(player.underworldData.corruption).eq(0);
    expect(player.megaCredits).eq(18);
  });
});
