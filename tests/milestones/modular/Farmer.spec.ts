import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Farmer} from '../../../src/server/milestones/modular/Farmer';
import {TestPlayer} from '../../TestPlayer';

describe('Farmer', () => {
  let milestone: Farmer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Farmer();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 5 animals or microbes', () => {
    const birds = new Birds();
    const ants = new Ants();
    player.playedCards.push(birds, ants);

    player.addResourceTo(ants);
    player.addResourceTo(ants);
    player.addResourceTo(birds);
    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.false;

    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.true;
  });
});
