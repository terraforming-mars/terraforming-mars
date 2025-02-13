import {expect} from 'chai';
import {Capital} from '../../../src/server/cards/base/Capital';
import {MedicalLab} from '../../../src/server/cards/base/MedicalLab';
import {cast, testGame} from '../../TestingUtils';

describe('MedicalLab', () => {
  it('Should play', () => {
    const card = new MedicalLab();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(0);
    player.playedCards.push(new Capital());
    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
