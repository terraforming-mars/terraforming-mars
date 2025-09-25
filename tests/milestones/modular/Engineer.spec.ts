import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Engineer} from '../../../src/server/milestones/modular/Engineer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';

describe('Engineer', () => {
  let milestone: Engineer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Engineer();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with zero production', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with less than 10 production', () => {
    player.production.add(Resource.ENERGY, 4);
    player.production.add(Resource.HEAT, 4);

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with exactly 10 production', () => {
    player.production.add(Resource.ENERGY, 8);
    player.production.add(Resource.HEAT, 2);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with more than 10 total production', () => {
    player.production.add(Resource.ENERGY, 21);
    player.production.add(Resource.HEAT, 37);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with only 1 production type', () => {
    player.production.add(Resource.HEAT, 14);

    expect(milestone.canClaim(player)).is.true;
  });
});
