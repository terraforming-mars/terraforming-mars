import {expect} from 'chai';
import {PowerPlant} from '../../src/server/cards/base/PowerPlant';
import {SolarPower} from '../../src/server/cards/base/SolarPower';
import {SpaceMirrors} from '../../src/server/cards/base/SpaceMirrors';
import {ResearchCoordination} from '../../src/server/cards/prelude/ResearchCoordination';
import {FieldCappedCity} from '../../src/server/cards/promo/FieldCappedCity';
import {VElectrician} from '../../src/server/milestones/VElectrician';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestingUtils';

describe('V. Electrician', () => {
  let milestone: VElectrician;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new VElectrician();
    [/* game */, player] = testGame(1);

    player.playedCards.push(new SolarPower(), new PowerPlant(), new SpaceMirrors());
  });

  it('Can claim with 4 Power tags', () => {
    // Only 3 power tags
    expect(milestone.canClaim(player)).is.false;

    // The fourth power tag
    player.playedCards.push(new FieldCappedCity());
    expect(milestone.canClaim(player)).is.true;
  });

  it('Wild tag counts', () => {
    player.playedCards.push(new ResearchCoordination());
    expect(milestone.canClaim(player)).is.true;
  });
});
