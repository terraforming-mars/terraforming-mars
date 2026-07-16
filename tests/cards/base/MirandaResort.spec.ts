import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {MirandaResort} from '../../../src/server/cards/base/MirandaResort';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MirandaResort', () => {
  it('Should play', () => {
    const card = new MirandaResort();
    const [/* game */, player] = testGame(2);

    player.playedCards.push(new BusinessNetwork());
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });
});
