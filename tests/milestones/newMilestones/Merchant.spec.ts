import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Merchant} from '../../../src/server/milestones/newMilestones/Merchant';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';

describe('Merchant', () => {
  let milestone: Merchant;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Merchant();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with insufficient resources after payment', () => {
    player.stock[Resource.MEGACREDITS] = 10;
    player.stock[Resource.STEEL] = 1;
    player.stock[Resource.TITANIUM] = 2;
    player.stock[Resource.PLANTS] = 2;
    player.stock[Resource.ENERGY] = 2;
    player.stock[Resource.HEAT] = 2;

    expect(milestone.canClaim(player)).to.be.false;
  });

  it('Can claim with exactly 2 of each resource after payment', () => {
    player.stock[Resource.MEGACREDITS] = 10;
    player.stock[Resource.STEEL] = 2;
    player.stock[Resource.TITANIUM] = 2;
    player.stock[Resource.PLANTS] = 2;
    player.stock[Resource.ENERGY] = 2;
    player.stock[Resource.HEAT] = 2;

    expect(milestone.canClaim(player)).to.be.true;
  });

  it('Can claim with more than 2 of each resource after payment', () => {
    player.stock[Resource.MEGACREDITS] = 20;
    player.stock[Resource.STEEL] = 3;
    player.stock[Resource.TITANIUM] = 4;
    player.stock[Resource.PLANTS] = 5;
    player.stock[Resource.ENERGY] = 6;
    player.stock[Resource.HEAT] = 7;

    expect(milestone.canClaim(player)).to.be.true;
  });

  it('Cannot claim with zero mc after payment', () => {
    player.stock[Resource.MEGACREDITS] = 8;
    player.stock[Resource.STEEL] = 2;
    player.stock[Resource.TITANIUM] = 2;
    player.stock[Resource.PLANTS] = 2;
    player.stock[Resource.ENERGY] = 2;
    player.stock[Resource.HEAT] = 2;

    expect(milestone.canClaim(player)).to.be.false;
  });
});
