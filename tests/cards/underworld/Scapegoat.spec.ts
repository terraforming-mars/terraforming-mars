import {expect} from 'chai';
import {Scapegoat} from '../../../src/server/cards/underworld/Scapegoat';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Scapegoat', () => {
  it('Should play', () => {
    const card = new Scapegoat();
    const [/* game */, player] = testGame(2);

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).to.eq(1);
  });
});
