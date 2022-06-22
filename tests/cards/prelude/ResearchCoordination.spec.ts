import {expect} from 'chai';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';

describe('ResearchCoordination', function() {
  it('Should play', function() {
    const card = new ResearchCoordination();
    const action = card.play();
    expect(action).is.undefined;
  });
});
