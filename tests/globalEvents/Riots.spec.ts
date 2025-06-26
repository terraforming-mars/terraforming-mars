import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Riots} from '../../src/server/turmoil/globalEvents/Riots';
import {addCity, testGame} from '../TestingUtils';

describe('Riots', () => {
  it('resolve play', () => {
    const card = new Riots();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    addCity(player);
    player.stock.add(Resource.MEGACREDITS, 10);
    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(6);
  });
});
