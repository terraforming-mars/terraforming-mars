import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';

describe('ResearchCoordination', function() {
  it('Should play', function() {
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const card = new ResearchCoordination();
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
