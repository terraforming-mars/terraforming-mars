import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Tunneler} from '../../../src/server/milestones/underworld/Tunneler';
import {TestPlayer} from '../../TestPlayer';

describe('Tunneler', () => {
  let milestone: Tunneler;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Tunneler();
    [/* game */, player] = testGame(2, {underworldExpansion: true});
  });

  it('Can claim', () => {
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});

    expect(milestone.canClaim(player)).is.false;

    player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});

    expect(milestone.canClaim(player)).is.true;
  });
});
