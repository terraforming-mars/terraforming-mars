import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Risktaker} from '../../../src/server/milestones/underworld/Risktaker';
import {TestPlayer} from '../../TestPlayer';
import {DustSeals} from '../../../src/server/cards/base/DustSeals';
import {EnergyTapping} from '../../../src/server/cards/base/EnergyTapping';
import {AncientShipyards} from '../../../src/server/cards/moon/AncientShipyards';
import {CorporateBlackmail} from '../../../src/server/cards/underworld/CorporateBlackmail';

describe('Risktaker', () => {
  let milestone: Risktaker;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Risktaker();
    [/* game */, player] = testGame(2, {underworldExpansion: true});
  });

  it('Can claim', () => {
    expect(milestone.getScore(player)).eq(0);

    // +1 VP
    player.playedCards.push(new DustSeals());

    expect(milestone.getScore(player)).eq(0);
    expect(milestone.canClaim(player)).is.false;

    // -1 VP
    player.playedCards.push(new EnergyTapping());

    expect(milestone.getScore(player)).eq(1);
    expect(milestone.canClaim(player)).is.false;

    // -1VP per resource
    const ancientShipyards = new AncientShipyards();
    player.playedCards.push(ancientShipyards);

    expect(milestone.getScore(player)).eq(1);
    expect(milestone.canClaim(player)).is.false;

    ancientShipyards.resourceCount = 4;

    expect(milestone.getScore(player)).eq(5);
    expect(milestone.canClaim(player)).is.true;

    // -2 VP event
    player.playedCards.push(new CorporateBlackmail());

    expect(milestone.getScore(player)).eq(7);
    expect(milestone.canClaim(player)).is.true;
  });
});
