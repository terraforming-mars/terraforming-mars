import {expect} from 'chai';
import {ResearchNetwork} from '../../../src/cards/prelude/ResearchNetwork';
import {MiningQuota} from '../../../src/cards/venusNext/MiningQuota';
import {SisterPlanetSupport} from '../../../src/cards/venusNext/SisterPlanetSupport';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MiningQuota', function() {
  it('Should play', function() {
    const card = new MiningQuota();
    const player = TestPlayers.BLUE.newPlayer();
    player.playedCards.push(new SisterPlanetSupport);
    expect(card.canPlay(player)).is.not.true;
    player.playedCards.push(new ResearchNetwork());
    expect(card.canPlay(player)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
