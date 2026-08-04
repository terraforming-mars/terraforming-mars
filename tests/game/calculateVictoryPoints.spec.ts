import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Banker} from '../../src/server/awards/Banker';
import {Resource} from '../../src/common/Resource';

describe('calculateVictoryPoints', () => {
  it('with two players, second place scores no award points', () => {
    const [game, player, player2] = testGame(2);
    game.fundAward(player, new Banker());
    player.production.add(Resource.MEGACREDITS, 7);
    player2.production.add(Resource.MEGACREDITS, 10);

    expect(player2.getVictoryPoints().awards).to.eq(5);
    expect(player.getVictoryPoints().awards).to.eq(0);
  });

  it('with three players, second place scores 2 award points', () => {
    const [game, player, player2, player3] = testGame(3);
    game.fundAward(player, new Banker());
    player.production.add(Resource.MEGACREDITS, 7);
    player2.production.add(Resource.MEGACREDITS, 10);

    expect(player2.getVictoryPoints().awards).to.eq(5);
    expect(player.getVictoryPoints().awards).to.eq(2);
    expect(player3.getVictoryPoints().awards).to.eq(0);
  });
});
