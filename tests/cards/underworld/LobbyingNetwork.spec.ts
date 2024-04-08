import {expect} from 'chai';
import {LobbyingNetwork} from '../../../src/server/cards/underworld/LobbyingNetwork';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('LobbyingNetwork', () => {
  it('Should play', () => {
    const card = new LobbyingNetwork();
    const [/* game */, player] = testGame(2);

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).to.eq(1);
  });
});
