import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Producer} from '../../../src/server/milestones/modular/Producer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';

describe('Producer', () => {
  let milestone: Producer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Producer();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with zero production', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with less than 16 total production', () => {
    player.production.add(Resource.MEGACREDITS, 5);
    player.production.add(Resource.STEEL, 2);
    player.production.add(Resource.TITANIUM, 2);
    player.production.add(Resource.PLANTS, 3);
    player.production.add(Resource.ENERGY, 1);
    player.production.add(Resource.HEAT, 2);

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with exactly 16 total production', () => {
    player.production.add(Resource.MEGACREDITS, 5);
    player.production.add(Resource.STEEL, 3);
    player.production.add(Resource.TITANIUM, 3);
    player.production.add(Resource.PLANTS, 2);
    player.production.add(Resource.ENERGY, 2);
    player.production.add(Resource.HEAT, 1);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with more than 16 total production', () => {
    player.production.add(Resource.MEGACREDITS, 10);
    player.production.add(Resource.STEEL, 3);
    player.production.add(Resource.TITANIUM, 3);
    player.production.add(Resource.PLANTS, 2);
    player.production.add(Resource.ENERGY, 4);
    player.production.add(Resource.HEAT, 3);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim when MC production is less than 0', () => {
    player.production.add(Resource.MEGACREDITS, -2);
    player.production.add(Resource.STEEL, 3);
    player.production.add(Resource.TITANIUM, 3);
    player.production.add(Resource.PLANTS, 3);
    player.production.add(Resource.ENERGY, 2);
    player.production.add(Resource.HEAT, 10);

    expect(milestone.canClaim(player)).is.true;
  });
});
