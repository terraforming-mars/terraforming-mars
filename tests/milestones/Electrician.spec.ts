import {expect} from 'chai';
import {PowerPlant} from '../../src/server/cards/base/PowerPlant';
import {SolarPower} from '../../src/server/cards/base/SolarPower';
import {SpaceMirrors} from '../../src/server/cards/base/SpaceMirrors';
import {ResearchCoordination} from '../../src/server/cards/prelude/ResearchCoordination';
import {FieldCappedCity} from '../../src/server/cards/promo/FieldCappedCity';
import {Game} from '../../src/server/Game';
import {Electrician} from '../../src/server/milestones/Electrician';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';

describe('Electrician', () => {
  let milestone: Electrician;
  let player: Player;

  beforeEach(() => {
    milestone = new Electrician();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);

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
