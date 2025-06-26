import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Philantropist} from '../../../src/server/milestones/modular/Philantropist';
import {TestPlayer} from '../../TestPlayer';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {AntiGravityTechnology} from '../../../src/server/cards/base/AntiGravityTechnology';
import {Ants} from '../../../src/server/cards/base/Ants';
import {GanymedeColony} from '../../../src/server/cards/base/GanymedeColony';
import {LargeConvoy} from '../../../src/server/cards/base/LargeConvoy';
import {EnergyTapping} from '../../../src/server/cards/base/EnergyTapping';
import {SpaceStation} from '../../../src/server/cards/base/SpaceStation';


describe('Philantropist', () => {
  let milestone: Philantropist;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Philantropist();
    [/* game */, player] = testGame(2);
  });

  it('Can claim', () => {
    expect(milestone.getScore(player)).eq(0);

    // +1 VP
    player.playedCards.push(new DustSeals());
    expect(milestone.getScore(player)).eq(1);
    expect(milestone.canClaim(player)).is.false;

    // +3 VP
    player.playedCards.push(new AntiGravityTechnology());
    expect(milestone.getScore(player)).eq(2);
    expect(milestone.canClaim(player)).is.false;

    // 1/2 VP
    player.playedCards.push(new Ants());
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.false;

    // 1/jovian
    player.playedCards.push(new GanymedeColony());
    expect(milestone.getScore(player)).eq(4);
    expect(milestone.canClaim(player)).is.false;

    // event (won't increase score)
    player.playedCards.push(new LargeConvoy());
    expect(milestone.getScore(player)).eq(4);
    expect(milestone.canClaim(player)).is.false;

    // -1 VP (wont't affect score)
    player.playedCards.push(new EnergyTapping());
    expect(milestone.getScore(player)).eq(4);
    expect(milestone.canClaim(player)).is.false;

    // +1 VP
    player.playedCards.push(new SpaceStation());
    expect(milestone.getScore(player)).eq(5);
    expect(milestone.canClaim(player)).is.true;
  });
});
