import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Fundraiser} from '../../../src/server/milestones/modular/Fundraiser';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';

describe('Fundraiser', () => {
  let milestone: Fundraiser;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Fundraiser();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with zero production', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with less than 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 8);

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with exactly 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 12);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with more than 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 15);

    expect(milestone.canClaim(player)).is.true;
  });
});
