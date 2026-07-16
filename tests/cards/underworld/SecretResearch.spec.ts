import {expect} from 'chai';
import {SecretResearch} from '../../../src/server/cards/underworld/SecretResearch';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('SecretResearch', () => {
  it('play', () => {
    const card = new SecretResearch();
    const [/* game */, player] = testGame(2, {coloniesExtension: true});

    expect(player.cardsInHand).is.empty;
    expect(player.underworldData.corruption).eq(0);

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).eq(1);
    expect(player.cardsInHand).has.length(3);
  });
});
