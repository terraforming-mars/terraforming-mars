import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Tunneler} from '../../../src/server/milestones/underworld/Tunneler';
import {TestPlayer} from '../../TestPlayer';
import {IPlayer} from '../../../src/server/IPlayer';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('Tunneler', () => {
  let milestone: Tunneler;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Tunneler();
    [/* game */, player] = testGame(2, {underworldExpansion: true});
  });

  it('Can claim', () => {
    function excavate(player: IPlayer) {
      const space = UnderworldExpansion.excavatableSpaces(player)[0];
      space.undergroundResources = 'nothing';
      space.excavator = player;
    }

    excavate(player);
    excavate(player);
    excavate(player);
    excavate(player);
    excavate(player);
    excavate(player);

    expect(milestone.canClaim(player)).is.false;

    excavate(player);
    expect(milestone.canClaim(player)).is.true;
  });
});
